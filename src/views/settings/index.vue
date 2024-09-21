<script setup lang="ts">
import { Icon } from '@vicons/utils';
import { LeftOutlined } from '@vicons/antd';
</script>
<template>
    <div class="wrap">
        <div class="top">
            <span>
                <Icon>
                    <LeftOutlined />
                </Icon>
                返回主页
            </span>
        </div>
        <div class="middle">
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </div>
</template>
<style scoped lang="">
.wrap {
    width: 100%;
    height: 100%;

    .top {
        width: 70%;
        height: 50px;
        line-height: 50px;
        margin: 15px auto;
        background-color: #eecccc;
        padding-left: 30px;

        span {
            color: #19a059;
        }

        .xicon >>> svg {
            height: 12px;
        }
    }

    .middle {
        width: 70%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        .left {
            width: 20%;
            height: 100%;
            background-color: aquamarine;
            margin-right: 1%;
        }

        .right {
            width: 79%;
            height: 100%;
            background-color: antiquewhite;
        }
    }
}
</style>
