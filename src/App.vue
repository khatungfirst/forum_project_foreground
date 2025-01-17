<!--
1111111
 * @Descripttion: 顶级routerVIew
 * @version: 
 * @Author: zhoukai
 * @Date: 2022-10-26 16:42:22
 * @LastEditors: zhoukai
 * @LastEditTime: 2023-03-27 10:15:27
-->
<script setup lang="ts">
// import { NMessageProvider } from 'naive-ui';
import { NDialogProvider } from 'naive-ui'; // 确保导入的组件名正确
</script>

<template>
    <NDialogProvider>
        <n-message-provider>
            <router-view v-slot="{ Component, route }">
                <!-- 缓存的视图 -->
                <keep-alive>
                    <component v-if="route.meta.keepAlive" :is="Component" :key="route.name || route.fullPath" />
                </keep-alive>
                <!-- 不缓存的视图 -->
                <component v-if="!route.meta.keepAlive" :is="Component" />
            </router-view>
        </n-message-provider>
    </NDialogProvider>
</template>

<style scoped></style>
