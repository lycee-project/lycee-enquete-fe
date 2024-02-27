<template>
  <v-container>
    <v-row
      v-for="ans in answers"
      :key="ans.answerId"
    >
      <v-checkbox
        v-model="selectedIndexes"
        :label="ans.description"
        :value="ans.answerId"
        hide-details
      ></v-checkbox>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'AnswerList',
  props: {
    answers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedIndexes: []
    }
  }
}
</script>

<style scoped>

</style>
