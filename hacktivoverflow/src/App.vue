<template>
  <div id="app">
    <navigation @show-login-panel="showLogin = true"/>
    <sign-in v-if="showLogin"/>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import navbar from '@/components/TheNavbar'
import signIn from '@/components/SignIn'
import {mapState, mapActions} from 'vuex'
export default {
  name: 'app',
  components: {
    navigation: navbar,
    'sign-in': signIn
  },
  data () {
    return {
      ...mapState([
        'userDetails'
      ]),
      showLogin: false
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
