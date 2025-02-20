import { ref } from 'vue';
import { getImageUrl } from '@/config/apis/publicArticle';

export default function (type: string) {
    const image_url = ref('');

    const isFit = ref(true);

    const getUrl = async (item: any) => {
        const fd = new FormData();
        fd.append('files', item.file.file);
        fd.append('type', type);
        const { data, msg } = await getImageUrl(fd);
        if (type === '文章封面' && msg === '上传的图片比例不对') {
            console.log('222');
            isFit.value = false;
        } else {
            console.log('333');
            image_url.value = data[0].url;
        }
    };

    return { image_url, getUrl, isFit };
}
