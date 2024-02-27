import { shallowMount } from '@vue/test-utils'
import TopView from '@/components/sample/MultiDialogView.vue'

describe('MultiDialogView.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(TopView, {
      props: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
