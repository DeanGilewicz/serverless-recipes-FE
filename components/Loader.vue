<template>
	<div class="loader">
		<div class="loader-dual-ring"></div>
	</div>
</template>

<script>
export default {}
</script>

<style>
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
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
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