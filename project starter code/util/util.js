import fs from "fs";
import Jimp from "jimp";


export const tempDir = `${process.cwd()}/tmp`

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
            if(full_file !== except_for) {
                fs.unlinkSync(full_file);
            }
        } catch (e) {
            console.log(`Failed to delete ${file}`)
        }
    }
}
