import { ref } from 'vue'

class GlobalState {
  modalState = ref(0)

}

export const globalState = new GlobalState()
