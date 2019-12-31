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
      <nuxt-link to="/recipe-add">Add Recipe</nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'auth',
  middleware: ['auth'],
  components: {},
  computed: {
    ...mapState('recipe', ['recipes'])
  },
  created() {
    // check vuex for recipes
    if (this.$store.getters['recipe/recipes'].length < 1) {
      return this.$axios
        .$get('/dev/api/recipes', {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          }
        })
        .then((res) => {
          // add recipe to vuex
          this.$store.dispatch('recipe/setRecipes', res.Items)
        })
        .catch((e) => {
          // console.error(e)
        })
    }
  },
  methods: {}
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
