export const dynamic = 'force-dynamic' // defaults to auto
import Replicate from "replicate";


const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN,});
const model_owner = 'jonasloos';
const model_name = 'sdxl-turbo-h-space-modification-model'
let model_version = null;


export async function GET(request) {
    if (model_version === null) {
        const model_versions = await replicate.models.versions.list(model_owner, model_name);
        model_version = model_versions.results[0].id;
    }
    const output = await replicate.run(`${model_owner}/${model_name}:${model_version}`, {input: request.body});
    return new Response(output, {
        headers: {
            'content-type': 'application/json',
        },
    })
}
