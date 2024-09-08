<!-- 渲染图标的组件 -->
<script lang="ts" setup>
import { defineProps } from 'vue';
import { Icon } from '@vicons/utils';
//声明组件的属性类型
const props = defineProps<{
    icon: any; // 传入的图标组件
    color: string; // 图标颜色
    size: number; // 图标大小
    showBadge: boolean; //默认是否显示徽章
    badgeValue: number; //默认徽章类型
}>();
</script>
<template>
    <div class="icon">
        <n-float-button position="relative">
            <template v-if="props.showBadge && props.badgeValue > 0">
                <!-- 根据 showBadge 条件渲染 -->
                <n-badge :value="props.badgeValue" :offset="[6, -8]" :color="props.color">
                    <Icon :color="props.color" :size="props.size">
                        <component :is="props.icon" />
                    </Icon>
                </n-badge>
            </template>
            <template v-else>
                <Icon :color="props.color" :size="props.size">
                    <component :is="props.icon" />
                </Icon>
            </template>
        </n-float-button>
    </div>
</template>
<style scoped lang="scss">
.icon {
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 45px;
    background-color: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    margin-bottom: 20px;
}
.icon:hover {
    cursor: pointer;
}
</style>
