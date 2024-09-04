import { mount, createLocalVue } from '@vue/test-utils';
import IndexPage from '@/pages/IndexPage.vue';
import axios from 'axios';
import Quasar from 'quasar';

jest.mock('axios');

const localVue = createLocalVue();
localVue.use(Quasar);

describe('IndexPage.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(IndexPage, {
      localVue,
    });
  });

  it('should fetch data on mount', async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, name: 'John Doe', age: 30 }],
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.rows).toEqual([{ id: 1, name: 'John Doe', age: 30 }]);
  });

  it('should handle add submit', async () => {
    axios.post.mockResolvedValue({
      data: { id: 2, name: 'Jane Doe', age: 25 },
    });
    wrapper.setData({ form: { name: 'Jane Doe', age: 25 } });
    await wrapper.vm.handleAddSubmit();
    expect(axios.post).toHaveBeenCalledWith(
      'https://dahua.metcfire.com.tw/api/CRUDTest',
      { name: 'Jane Doe', age: 25 }
    );
  });

  it('should handle fetch data error', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await wrapper.vm.fetchData();
    expect(wrapper.vm.rows).toEqual([]);
  });
});
