import fs from "fs";
import Jimp from "jimp";
import * as https from "https";


export const tempDir = `${process.cwd()}/tmp`

export async function downloadToLocal(image_url) {
    return new Promise((resolve, reject) => {
        const parts = image_url.split('.')
        const extension = parts[parts.length - 1]
        const outpath =
            `${tempDir}/buffered.${Math.floor(Math.random() * 2000)}.${extension}`;

        // Note - used GPT-4 for the initial skeleton of this https call
        const file = fs.createWriteStream(outpath);
        const headers = {'User-Agent': 'SampleImageDownloadScript (http://axtensoft.com; david.stiennon@gmail.com)'}
        https.get(image_url,{headers: headers, }, (response) => {
            if (response.statusCode !== 200) {
                const message = `Failed to get '${image_url}' (${response.statusCode})`;
                reject(message)
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                // Close the file stream
                file.close();
                console.log('Image downloaded and saved!');
                resolve(outpath)
            });
        }).on('error', (err) => {
            // Handle errors like DNS resolution, TCP level errors, etc.
            const error = 'Error downloading image:' + err.message;
            reject(error)
        });
    })
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
    return new Promise(async (resolve, reject) => {
        try {
            const photo = await Jimp.read(inputURL);
            const outpath =
                `${tempDir}/filtered.` + Math.floor(Math.random() * 2000) + ".jpg";
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(outpath, (img) => {
                    resolve(outpath);
                });
        } catch (error) {
            reject(error);
        }
    });
}

// deleteLocalFiles
// helper function to clean up temporary files
export async function deleteLocalFiles({except_for}) {
    const localFiles = fs.readdirSync(tempDir)
    for (let file of localFiles) {
        const full_file = `${tempDir}/${file}`
        try {
            // clean up directory, but don't delete the file we just created
            if (full_file !== except_for) {
                fs.unlinkSync(full_file);
            }
        } catch (e) {
            console.log(`Failed to delete ${file}`)
        }
    }
}
