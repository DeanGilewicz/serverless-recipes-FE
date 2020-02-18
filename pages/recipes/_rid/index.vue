<template>
  <div class="page-recipe">
    <div class="py-4 text-center">
      <h1 class="text-3xl">RECIPE</h1>
    </div>
    <nav class="py-4 text-center">
      <nuxt-link
        to="/recipes"
        class="inline-block w-full xs:w-auto bg-green-500 text-white font-bold py-2 px-4 mb-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
        >All Recipes</nuxt-link
      >
      <nuxt-link
        v-if="recipe"
        :to="'/recipes/' + this.$route.params.rid + '/edit'"
        class="inline-block w-full xs:w-auto bg-green-500 text-white font-bold py-2 px-4 mb-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
        >Edit {{ recipe.recipeName }}
      </nuxt-link>
    </nav>
    <div v-if="recipe" class="sm:flex border-t-2 border-gray-600">
      <div v-if="recipe.image" class="p-4">
        <img
          :src="recipe.image"
          :alt="recipe.recipeName"
          class="custom-max-width sm:max-w-xs"
        />
      </div>
      <div
        class="sm:flex sm:justify-center sm:items-center sm:flex-auto p-4 text-center bg-gray-300"
      >
        <p v-if="recipe.recipeName">{{ recipe.recipeName }}</p>
      </div>
    </div>
    <div v-if="recipe" class="py-6 px-4 border-b-4 border-gray-600 bg-gray-300">
      <ul v-if="recipe.ingredients">
        <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
          <p class="block text-gray-700 text-sm font-bold mb-2">
            {{ recipe.ingredients.length > 1 ? 'Ingredients' : 'Ingredient' }}
          </p>
          <span>{{ ingredient.amount }}</span>
          <span>{{ ingredient.name }}</span>
        </li>
      </ul>
      <div v-if="recipe.instructions" class="mt-6">
        <p class="block text-gray-700 text-sm font-bold mb-2">Instructions</p>
        <span>{{ recipe.instructions }}</span>
      </div>
    </div>
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
  name: 'Recipe',
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
    // xhr request to get recipe
    this.$store
      .dispatch('recipe/getRecipe', this.$route.params.rid)
      .catch((e) => {
        if (e.message === 'No recipe exists') {
          return this.$router.push('/recipes')
        }
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
