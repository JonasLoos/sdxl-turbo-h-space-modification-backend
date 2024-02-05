from typing import Optional
from pydantic import BaseModel
from diffusers import AutoPipelineForText2Image
import torch
import io, base64, requests
from pathlib import Path


# load stable diffusion model
model_id = 'stabilityai/sdxl-turbo'
pipe = AutoPipelineForText2Image.from_pretrained(model_id, torch_dtype=torch.float16).to('cuda')

# load h-space directions
directions_path = Path('/persistent-storage/sdxl-turbo-hspace-modification/directions.pt')
if not directions_path.exists():
    r = requests.get('https://github.com/JonasLoos/sdxl-turbo-h-space-modification-model/blob/main/directions.pt?raw=true')
    directions_path.parent.mkdir(parents=True, exist_ok=True)
    directions_path.write_bytes(r.content)
directions = torch.load(directions_path).half().to('cuda')


# define input arguments
class Item(BaseModel):
    prompt: str
    scales: str
    diffusion_steps: Optional[int] = 1
    seed: Optional[int] = 42



def predict(item, run_id, logger):
    item = Item(**item)

    # check inputs
    if item.diffusion_steps != 1:
        raise NotImplementedError("Diffusion steps != 1 is not supported yet")
    scales = torch.tensor([float(s) for s in item.scales.split(',')], device='cuda').half().to('cuda')
    if len(scales) != len(directions):
        raise ValueError("Number of scales must match number of directions")

    # run prediction
    def hook_fn(module, input, output):
        '''Modify h-space'''
        return output + (directions * scales.reshape((-1,1,1,1))).sum(dim=0, keepdim=True)
    with torch.no_grad(), pipe.unet.mid_block.register_forward_hook(hook_fn):
        img = pipe(prompt = item.prompt, num_inference_steps = item.diffusion_steps, guidance_scale = 0.0, generator = torch.Generator('cuda').manual_seed(item.seed)).images[0]

    # convert image to base64
    buffered = io.BytesIO()
    img.save(buffered, format='PNG')
    finished_image = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return finished_image
