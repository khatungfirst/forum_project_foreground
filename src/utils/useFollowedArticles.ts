// // useFollowedArticles.ts
// import { ref } from 'vue';
// import { follower_article } from '@/config/apis/articleDetail';

// export default function useFollowedArticles(dataObj) {
//     const followedArticles = ref([]);

//     const fetchFollowedArticles = async () => {
//         const response = await follower_article({
//             page: dataObj.page,
//             limit: dataObj.limit,
//             kind: dataObj.kind
//         });
//         if (response.code === 2000) {
//             followedArticles.value = response.data.selectedList;
//         } else {
//             console.error('获取关注的人的文章失败', response.message);
//         }
//     };

//     return {
//         followedArticles,
//         fetchFollowedArticles
//     };
// }
