<template>
  <div>
    <agent uuid="1258101d-19cc-4de6-a197-63eebaf23002" :socket="socket"></agent>
    <agent v-for="agent in agents" :uuid="agent.uuid" :key="agent.uuid"></agent>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
const io = require('socket.io-client')
const socket = io()

module.exports = {
  data() {
    return {
      agents: [],
      error: null,
      socket
    }
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {}
  }
}
</script>

<style>
body {
  font-family: Arial;
  background: #f8f8f8;
  margin: 0;
}
</style>