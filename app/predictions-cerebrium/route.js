export const dynamic = 'force-dynamic';


const myHeaders = new Headers();
myHeaders.append('Authorization', process.env.CEREBRIUM_API_TOKEN);
myHeaders.append('Content-Type', 'application/json');


export async function GET(request) {
    try {
        console.log('GET request:', request.url)
        const input_params = Object.fromEntries(new URL(request.url).searchParams);
        console.log('Calling API with:', input_params);

        const raw = JSON.stringify(input_params);
        
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'manual'
        };
        const output = await fetch('https://run.cerebrium.ai/v3/p-6fd4d064/sdxl-turbo-hspace-modification/predict', requestOptions).then(response => response.json());
        console.log('Success:', output);
        return new Response(JSON.stringify({success: true, result: 'data:image/png;base64,' + output.result}), {
            headers: {
                'content-type': 'application/json',
                'Cache-Control': 'public, s-maxage=1',
                'CDN-Cache-Control': 'public, s-maxage=60',
                'Vercel-CDN-Cache-Control': 'public, s-maxage=3600',
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
