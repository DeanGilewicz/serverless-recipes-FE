<template>
  <div>
    <h1>Recipe</h1>
    <div v-if="recipe">
      <nuxt-link :to="'/recipes/' + this.$route.params.rid + '/edit'"
        >Edit {{ recipe.recipeName }}</nuxt-link
      >
    </div>
    <p v-if="recipe">{{ recipe.recipeName }}</p>
    <ul v-if="recipe">
      <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
        <span>{{ ingredient.amount }}</span>
        <span>{{ ingredient.name }}</span>
      </li>
    </ul>
    <p v-if="recipe">{{ recipe.instructions }}</p>
    <Loader :showLoader="currentState === 'pending'" />

    <Modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Oh no something went wrong</h3>
      <p slot="body">We were unable to load your recipe</p>
      <div slot="footer">
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Close
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
export default {
  name: 'recipe',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: { Loader, Modal },
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    ...mapState('recipe', ['recipe']),
    currentState() {
      return this.$store.getters['state-machine/currentState']
    },
    errors() {
      return this.$store.getters['messages/errors']
    }
  },
  created() {
    // clear recipe so no display stale data from other recipe
    this.$store.dispatch('recipe/setRecipe', null)
    // trigger loading state
    this.$store.dispatch('state-machine/updateInitialState')
    // xhr request when enter a single recipe
    return this.$axios
      .$get('/dev/api/recipes/' + this.$route.params.rid, {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
        // redirect if no recipe exists
        if (res.Items.length < 1) {
          return this.$router.push('/recipes')
        }
        // trigger loading state
        this.$store.dispatch('state-machine/updatePendingState', 'success')
        // add recipe to vuex
        this.$store.dispatch('recipe/setRecipe', res.Items[0])
      })
      .catch((e) => {
        // console.error(e)
        // trigger loading state
        this.$store.dispatch('state-machine/updateFailureState')
        // show modal
        this.showModal = true
      })
  },
  methods: {
    onCloseModal() {
      // reset state machine
      this.$store.dispatch('state-machine/setInitialState')
      // close modal
      this.showModal = false
    }
  }
}
</script>

<style></style>
