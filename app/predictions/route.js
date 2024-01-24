export const dynamic = 'force-dynamic';
import Replicate from "replicate";


const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN,});
const model_owner = 'jonasloos';
const model_name = 'sdxl-turbo-h-space-modification-model'
let model_version = null;


export async function GET(request) {
    try {
        const { inputData } = new URLSearchParams(request.url)
        if (model_version === null) {
            const model_versions = await replicate.models.versions.list(model_owner, model_name);
            model_version = model_versions.results[0].id;
        }
        console.log('Calling API with:', inputData);
        const output = await replicate.run(`${model_owner}/${model_name}:${model_version}`, {input: inputData});
        console.log('Success:', output);
        return new Response(JSON.stringify({success: true, result: output}), {
            headers: {
                'content-type': 'application/json',
            },
        })
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({success: false, error: e}), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }
}
