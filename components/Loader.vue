<template>
	<div v-if="showLoader" class="loader">
		<div class="loader-dual-ring"></div>
	</div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    showLoader: {
      type: Boolean,
      required: true,
      default: false
    }
  }
}
</script>

<style>
.loader {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(99, 179, 237, 0.3);
}
.loader-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.loader-dual-ring:after {
  content: ' ';
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #63b3ed;
  border-color: #63b3ed transparent #63b3ed transparent;
  animation: loader 1.2s linear infinite;
}
@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>