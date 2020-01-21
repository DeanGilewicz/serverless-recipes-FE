<template>
  <div class="w-full">
    <div class="max-w-lg">
      <h1>Recipes</h1>
      <div v-if="recipes" class="container-recipes">
        <div
          v-for="recipe in recipes"
          :key="recipe.recipeId"
          class="container-recipe"
        >
          <nuxt-link :to="'/recipes/' + recipe.recipeId">
            <p>{{ recipe.recipeName }}</p>
            <p v-if="recipe.image">
              <img :src="recipe.image" :alt="recipe.recipeName" />
            </p>
          </nuxt-link>
        </div>
      </div>
      <nuxt-link to="/recipes/add">Add Recipe</nuxt-link>
    </div>
    <Loader :showLoader="currentState === 'pending'" />

    <Modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Oh no something went wrong</h3>
      <p slot="body">We were unable to load your recipes</p>
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
  name: 'Recipes',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: { Loader, Modal },
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    ...mapState('recipe', ['recipes']),
    currentState() {
      return this.$store.getters['state-machine/currentState']
    }
  },
  created() {
    // check vuex for recipes
    if (!this.$store.getters['recipe/recipes'].length > 0) {
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // xhr get recipes
      this.$store.dispatch('recipe/getRecipes').catch((e) => {
        // show modal
        this.showModal = true
      })
    }
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

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
