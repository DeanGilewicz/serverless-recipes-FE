<template>
  <div>
    <h1>Recipe</h1>
    <p v-if="recipe">{{ recipe.recipeName }}</p>
		<ul v-if="recipe">
			<li v-for="(ingredient,index) in recipe.ingredients" :key="index">
				<span>{{ingredient.amount}}</span>
				<span>{{ingredient.name}}</span>
			</li>
		</ul>
		<p v-if="recipe">{{ recipe.instructions }}</p>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'auth',
  middleware: ['auth'],
  components: {},
  created() {
    // check vuex for this recipe - if fail then xhr request this recipe
    if (!this.$store.getters['recipe/recipe']) {
      // stick it in vuex store
      return this.$axios
        .$get('/dev/api/recipes/' + this.$route.params.rid, {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          }
        })
        .then((res) => {
          // add recipe to vuex
          this.$store.dispatch('recipe/setRecipe', res.Items[0])
        })
        .catch((e) => {
          // console.error(e)
          // Unable to get recipe
        })
    }
  },
  computed: mapState('recipe', ['recipe'])
}
</script>

<style></style>
