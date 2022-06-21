<template>
  <div id="wrapper">
    <div id="logo">
      things
      <div id="white-dot">.</div>
      <div id="dot">.</div>
    </div>
  </div>
</template>
<style scoped>
#wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

#logo {
  position: relative;
}
#white-dot {
  color: #fff;
}
#dot {
  animation: bounce 0.5s cubic-bezier(0.1, 1, 1, 1) alternate infinite;
}
#logo,
#dot,
#white-dot {
  font-size: 70px;
  font-family: serif;
}
#white-dot,
#dot {
  position: absolute;
  top: -42px;
  left: 56px;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-16px);
  }
}
</style>
