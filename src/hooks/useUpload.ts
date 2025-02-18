import { ref } from 'vue';
import { getImageUrl } from '@/config/apis/publicArticle';

export default function (type: string) {
    const image_url = ref('');

    const getUrl = async (item: any) => {
        const fd = new FormData();
        fd.append('files', item.file.file);
        console.log(item.file.file, 'file');
        fd.append('type', type);
        const { data } = await getImageUrl(fd);
        image_url.value = data[0].url;
    };

    return { image_url, getUrl };
}
