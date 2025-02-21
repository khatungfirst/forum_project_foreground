<script setup lang="ts">
import { useRouter } from 'vue-router';
// import axios from 'axios';
import { getCompressImage } from '@/config/apis/publicArticle';
import { Icon } from '@vicons/utils';
import { EyeOutlined, LikeTwotone } from '@vicons/antd';

const prop = defineProps({
    item: {
        type: Object as () => {
            title: string;
            summary: string;
            nickname: string;
            daily_time: string;
            views_count: number;
            likes_count: number;
            image_url: string;
            tags: Array<{
                name: string;
            }>;
            id: string;
            status: boolean;
        },
        required: true,
        default: () => ({
            title: '',
            summary: '',
            nickname: '',
            daily_time: '',
            views_count: 0,
            likes_count: 0,
            image_url: '',
            tags: [{ name: '' }],
            id: '',
            status: false
        })
    }
});

onMounted(() => {
    compressImage();
});

//路由对象
const route = useRouter();

//查看文章详情的方法
const checkDetail = () => {
    route.push(`/articledetail/${prop.item.id}`);
};

//点击标签的触发事件
const clickTags = () => {
    console.log('标签被点击了');
};

//声明压缩后的封面图
const imageUrl = ref('');
//压缩封面图
const compressImage = async () => {
    console.log('压缩图片');

    //压缩封面图
    // const params = new URLSearchParams({
    //     path: prop.item.image_url,
    //     width: '150',
    //     height: '100',
    //     level: '5'
    // });
    // await fetch(`/instantly_compress_image?${params}`, {
    //     method: 'GET'
    // }).then(async (res) => {
    //     const blob = await res.blob();
    //     const imageURL = URL.createObjectURL(blob);
    //     imageUrl.value = imageURL.replace('blob:', '');
    //     console.log(imageUrl.value, 'image');
    // });
    if (prop.item.image_url !== '') {
        const res = await getCompressImage({
            path: prop.item.image_url,
            width: '150',
            height: '100',
            level: '5'
        });
        const blob = new Blob([res], { type: 'image/jpeg' });

        // 创建一个临时 URL
        imageUrl.value = URL.createObjectURL(blob).replace('blob:', '');
        // const blob = res.blob();
        console.log(imageUrl.value, 'blob');
    }
    // const params = reactive({
    //     path: prop.item.image_url,
    //     width: '150',
    //     height: '100',
    //     level: '5'
    // });
    // axios.get('/instantly_compress_image', { params }).then(async (res) => {
    //     // const blob = await res.data.blob();
    //     // const imageURL = URL.createObjectURL(blob);
    //     // imageUrl.value = imageURL.replace('blob:', '');
    //     // console.log(imageUrl.value, 'image');
    //     console.log(res, 'res');
    // });
};

//文章题目和概述高亮显示关键词
const highlightedTitle = ref(prop.item.title);
const highlightedSummary = ref(prop.item.summary);
</script>

<template>
    <ul class="content" @click="checkDetail">
        <li class="whole">
            <div class="left">
                <div class="left-left">
                    <h3 v-html="highlightedTitle"></h3>
                    <slot name="type"></slot>
                </div>
                <n-ellipsis
                    :line-clamp="2"
                    style="color: #868686; font-size: 12px; margin: 8px 0px"
                    v-html="highlightedSummary"
                ></n-ellipsis>
                <div class="detail-bottom">
                    <span>
                        {{ prop.item.nickname }}
                    </span>
                    <span class="time">{{ prop.item.daily_time }}</span>
                    <span class="icon">
                        <Icon>
                            <EyeOutlined />
                        </Icon>
                        {{ prop.item.views_count }}
                    </span>
                    <span class="icon">
                        <Icon>
                            <LikeTwotone />
                        </Icon>
                        {{ prop.item.likes_count }}
                    </span>
                    <ul @click.stop="clickTags">
                        <li v-for="(tag, index) in prop.item.tags" :key="index" class="tag">
                            {{ tag.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <slot class="edit" name="edit"></slot>
            <div class="right" v-if="prop.item.image_url !== ''">
                <img :src="prop.item.image_url" alt="" />
            </div>
            <slot class="cancelCollect" name="cancelCollect"></slot>
        </li>
    </ul>
</template>

<style scoped lang="scss">
.content {
    width: 100%;

    .other {
        display: grid;
        grid-template-columns: 5fr 1fr;
    }
}

.content:hover {
    cursor: pointer;
}
.whole {
    display: flex;
    padding: 10px 0px;
    border-bottom: 1px solid rgb(223, 217, 217);
    position: relative;
    z-index: 999;
    width: 98%;

    .left {
        flex: 1;

        .left-left {
            height: 20px;
            margin-bottom: 10px;
        }

        h3 {
            float: left;
            margin-right: 10px;
        }
        .detail-bottom {
            span {
                margin: 0px 5px;
                font-size: 14px;
                color: #868686;
                padding: 0px 5px;
            }

            .time {
                padding: 0px 10px;
                border-left: 1px solid #d6d3d3;
                border-right: 1px solid #d6d3d3;
            }

            .icon {
                position: relative;
            }

            .icon :deep(svg) {
                height: 16px;
                position: absolute;
                /* top: 0px; */
            }
        }
        ul {
            display: inline-block;
            float: right;
            .tag {
                font-size: 12px;
                color: #7d8791;
                display: inline-block;
                margin-right: 10px;
                padding: 1px 10px;
                background-color: #f2f2f2;
            }
        }
    }

    .right {
        display: flex;
        flex-direction: row-reverse;
        position: relative;
        /* float: right; */
        margin-left: 8px;

        img {
            width: 150px;
            height: 100px;
            object-fit: cover;
        }
    }
}
</style>
