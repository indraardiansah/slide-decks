<script setup lang="ts">
/**
 * Gradient text in the brand colours.
 *
 *   <GradientText>Company Growth Recap</GradientText>
 *   <GradientText as="h1" variant="cool">Platform Security</GradientText>
 *
 * In Markdown you can also use the class directly:
 *   # Company Growth Recap {.text-gradient}
 *   <span class="text-gradient">inline text</span>
 */
withDefaults(defineProps<{
  as?: string
  variant?: 'warm' | 'cool' | 'full'
}>(), {
  as: 'span',
  variant: 'warm',
})
</script>

<template>
  <component
    :is="as"
    :class="variant === 'warm' ? 'text-gradient' : `text-gradient-${variant}`"
  >
    <slot />
  </component>
</template>
