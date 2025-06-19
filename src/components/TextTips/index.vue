<template>
  <div class="hint-tip-container">
    <el-tooltip
      ref="tooltipRef"
      v-bind="$attrs"
      :effect="effect"
      :content="content"
      :placement="placement"
      :popper-class="['hint-tooltip', popperClass]"
      :show-arrow="showArrow"
      :show-after="showDelay"
      :hide-after="hideDelay">
      <template #content>
        <slot name="content"></slot>
      </template>
      <span class="trigger-icon">
        <slot name="icon">
          <el-icon :size="iconSize" :color="iconColor">
            <component :is="iconComponent" />
          </el-icon>
        </slot>
      </span>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { ElTooltip, ElIcon } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

/**
 * TextTip 组件
 * 用于显示提示信息的图标，支持自定义内容和样式
 * 支持更换icon、位置
 */
// 定义组件props
const props = withDefaults(
  defineProps<{
    content?: string
    placement?:
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'left'
      | 'left-start'
      | 'left-end'
      | 'right'
      | 'right-start'
      | 'right-end'
    effect?: 'dark' | 'light'
    iconComponent?: any
    iconSize?: number | string
    iconColor?: string
    showArrow?: boolean
    showDelay?: number
    hideDelay?: number
    popperClass?: string
  }>(),
  {
    content: '默认文字内容',
    placement: 'top',
    effect: 'dark',
    iconComponent: InfoFilled,
    iconColor: '#999',
    iconSize: 16,
    showArrow: true,
    popperClass: '',
  }
)

const tooltipRef = ref<InstanceType<typeof ElTooltip> | null>(null)

// 暴露方法，允许外部控制显示/隐藏
defineExpose({
  show: () => tooltipRef.value?.onOpen(),
  hide: () => tooltipRef.value?.hide(),
})
</script>

<style lang="scss">
.hint-tip-container {
  display: inline-flex;

  .trigger-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  // 自定义tooltip样式
  .hint-tooltip {
    max-width: 300px;
    padding: 12px;
    line-height: 1.5;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

    &.el-tooltip__popper.is-dark {
      color: #ecf0f1;
      background: #2c3e50;
    }

    &.el-tooltip__popper.is-light {
      color: #2c3e50;
      background: #fff;
      border: 1px solid #eee;
    }
  }
}
</style>
