import { ref } from 'vue';
import { getImageUrl } from '@/config/apis/publicArticle';

export default function () {
    const image_url = ref('');

    const getUrl = async (item: any) => {
        const fd = new FormData();
        fd.append('files', item.file.file);
        fd.append('width', '200');
        const { data } = await getImageUrl(fd);
        image_url.value = data[0];
        console.log(image_url.value, '000000000');
    };

    return { image_url, getUrl };
}
