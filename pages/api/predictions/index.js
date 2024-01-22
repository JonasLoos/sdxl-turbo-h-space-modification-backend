import Replicate from "replicate";


const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN,});
const model_owner = 'jonasloos';
const model_name = 'sdxl-turbo-h-space-modification-model'
let model_version = null;


export default async function handler(req, res) {
    if (model_version === null) {
        const model_versions = await replicate.models.versions.list(model_owner, model_name);
        model_version = model_versions.results[0].id;
    }
    const output = await replicate.run(`${model_owner}/${model_name}:${model_version}`, {input: req.body});
    res.status(200).json(output);
}
