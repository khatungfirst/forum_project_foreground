<script setup lang="ts">
import userInfo from '@/views/settings/userInfo/index.vue';
import numberSettings from '@/views/settings/numberSettings/index.vue';
import letter from '@/views/settings/letter/index.vue';
import '@/assets/css/icon/iconfont.css';
import { Icon } from '@vicons/utils';
import { LeftOutlined, MailOutlined } from '@vicons/antd';
</script>
<template>
    <div class="wrap">
        <div class="top">
            <span>
                <Icon :size="12">
                    <LeftOutlined />
                </Icon>
                返回主页
            </span>
        </div>
        <div class="middle">
            <div class="left">
                <n-space vertical>
                    <n-tabs type="card" animated placement="left">
                        <n-tab-pane name="oasis">
                            <template #tab>
                                <i class="iconfont" style="font-size: 18px">&#xe608;</i>
                                <span>个人资料</span>
                            </template>
                            <userInfo></userInfo>
                        </n-tab-pane>
                        <n-tab-pane name="the beatles">
                            <template #tab>
                                <i class="iconfont" style="font-size: 18px">&#xe6e7;</i>
                                <span>账号设置</span>
                            </template>
                            <numberSettings></numberSettings>
                        </n-tab-pane>
                        <n-tab-pane name="jay chou">
                            <template #tab>
                                <Icon :size="20">
                                    <MailOutlined />
                                </Icon>
                                <span>私信设置</span>
                            </template>
                            <letter></letter>
                        </n-tab-pane>
                    </n-tabs>
                </n-space>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.wrap {
    @include all;
    background-color: #f2f3f5;
    overflow: hidden;

    .top {
        width: 75%;
        height: 50px;
        line-height: 50px;
        margin: 15px auto;
        background-color: #fff;
        padding-left: 30px;

        span {
            color: #19a059;
        }

        span:hover {
            cursor: pointer;
        }
    }

    .middle {
        width: 75%;
        height: 90%;
        margin: 0 auto;
        display: flex;
        .left {
            @include all;
            .n-tabs {
                height: 100%;
            }

            .n-tabs :deep(.n-tabs-nav) {
                background-color: #fff;
                margin-right: 15px;
            }

            .n-tabs :deep(.n-tab-pane) {
                width: 100%;
                background-color: #fff;
                padding: 0px;
            }

            .n-tabs :deep(.n-tabs-tab-wrapper) {
                width: 240px;
                border-radius: 40px;
                height: 60px;
                @include flex;
            }

            .n-tabs :deep(.n-tabs-tab) {
                background-color: #fff;
                border: none;
                border-radius: 40px;
                font-size: 15px;
                color: #8d9ec2;
            }

            .n-tabs :deep(.n-tabs-tab--active) {
                background-color: #daf0e4;
                height: 40px;
                width: 130px;
                border-radius: 40px;
                color: #1ea05a;
            }

            span {
                margin-left: 5px;
            }
        }
    }
}
</style>
