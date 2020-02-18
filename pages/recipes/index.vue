<template>
  <div class="page-home">
    <div class="py-4 text-center">
      <h1 class="text-3xl">RECIPES</h1>
    </div>
    <nav class="py-4 text-center">
      <nuxt-link
        to="/recipes/add"
        class="inline-block w-full xs:w-auto bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
        >Add Recipe</nuxt-link
      >
    </nav>
    <div v-if="recipes">
      <div
        v-for="recipe in recipes"
        :key="recipe.recipeId"
        class="mt-4 sm:mt-6 sm:flex border-t-2 border-gray-600"
      >
        <div class="p-4 sm:border-b-4 sm:border-gray-600">
          <img
            :src="cloudinaryOptimizedImage(recipe.image)"
            :alt="recipe.recipeName"
            class="custom-max-width sm:max-w-xs"
          />
        </div>
        <div
          class="sm:flex sm:justify-center sm:items-center sm:flex-auto p-4 text-center bg-gray-300 border-b-4 border-gray-600"
        >
          <nuxt-link
            :to="'/recipes/' + recipe.recipeId"
            class="block uppercase text-2xl"
          >
            <h2>{{ recipe.recipeName }}</h2>
          </nuxt-link>
        </div>
      </div>
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
    },
    cloudinaryOptimizedImage(image) {
      if (image) {
        const cloudinaryUploadUrl =
          'https://res.cloudinary.com/cloudassets/image/upload/'
        const optimizedUrl = image.split(cloudinaryUploadUrl)
        // add cloudinary optimizations
        optimizedUrl[0] = cloudinaryUploadUrl + 'q_auto,f_auto/'
        return optimizedUrl.join('')
      } else {
        return 'https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1579839990/recipes/recipe-placeholder.png'
      }
    }
  }
}
</script>

<style lang="css" scoped>
img.custom-max-width {
  width: 100%;
  max-width: 16rem;
  margin: 0 auto;
}

/* @media only screen and (min-width: 480px) {

} */

/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
/* .container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
} */

/* .title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
} */

/* .subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
} */
</style>
