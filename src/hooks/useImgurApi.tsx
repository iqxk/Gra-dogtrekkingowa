import { ImgurConfig } from "../utils/imgur";

export function useImgurApi() {
    const { rootUrl, apiKey } = ImgurConfig()

    const postPhoto = async (photo: Blob) => {
        var link: string = ''
        var deleteHash: string = ''
        const formdata = new FormData()
        formdata.append('image', photo)

        const result = 
        await fetch(rootUrl, {
            method: 'POST',
            body: formdata,
            headers: {
                Authorization: 'Client-ID ' + apiKey,
            },
        })
            .then(response => response.json())
            .then(response => {
                link = '' + response.data.link
                deleteHash = '' + response.data.deletehash
                //console.log(link);
                //console.log(deleteHash);
            }).catch(() => {
                
            })
        // console.log("result: ", result)

        return {
            link,
            deleteHash
        }
    }

    const deletePhoto = async (deleteHash: string) => {
        //const result = 
        await fetch(rootUrl + '/' + deleteHash, {
            method: 'DELETE',
            headers: {
                Authorization: 'Client-ID ' + apiKey,
            },
        })
            .then(response => response.json())
            .then(response => {
                //console.log(response);
            })
        //console.log("result: ", result)
    }

    return {
        postPhoto,
        deletePhoto,
    }
}