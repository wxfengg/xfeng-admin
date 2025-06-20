<template>
  <div class="hint-tip-container">
    <component
      :is="
        h(
          ElTooltip,
          { ...$attrs, ...props, ref: tooltipRef },
          {
            ...$slots,
            default: () =>
              $slots.default
                ? $slots.default()
                : h(
                    'span',
                    { class: 'trigger-icon' },
                    h(
                      ElIcon,
                      {
                        size: props.iconSize,
                        color: props.iconColor,
                      },
                      h(props.iconComponent)
                    )
                  ),
          }
        )
      " />
  </div>
</template>

<script lang="ts" setup>
import { h, getCurrentInstance } from 'vue'
import {
  type ElTooltipProps,
  ElTooltip,
  ElIcon,
  TooltipInstance,
} from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

interface TextTipProps {
  iconComponent?: any
  iconSize?: number | string
  iconColor?: string
}

// 定义组件props
const props = withDefaults(
  defineProps<TextTipProps & Partial<ElTooltipProps>>(),
  {
    content: '默认文字内容',
    placement: 'top',
    popperClass: 'hint-tooltip',
    showArrow: true,
    iconComponent: InfoFilled,
    iconSize: 16,
    iconColor: '#999',
  }
)

const vm = getCurrentInstance()
const tooltipRef = (ref: Element | ComponentPublicInstance | null) => {
  if (!ref || !vm) return
  vm.exposeProxy = vm.exposed = (ref as TooltipInstance) || {}
}
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
    max-width: 500px;
    padding: 12px;
    line-height: 1.5;
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
