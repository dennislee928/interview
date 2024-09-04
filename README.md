````markdown:README.md
# Quasar Project

## 關於我用的 Package（一開始的package之間衝突不少，花了一點時間重抓XD）

以下是 `package.json` 中的依賴包：

```json
{
  "name": "quasar-project",
  "version": "0.0.1",
  "description": "A Quasar Project",
  "productName": "Quasar App",
  "author": "zihyinhsu <jenny010328@gmail.com>",
  "private": true,
  "scripts": {
    "lint": "eslint --ext .js,.ts,.vue ./",
    "format": "prettier --write \"**/*.{js,ts,vue,scss,html,md,json}\" --ignore-path .gitignore",
    "test": "echo \"No test specified\" && exit 0",
    "test:unit": "jest",
    "dev": "quasar dev",
    "build": "quasar build"
  },
  "dependencies": {
    "@quasar/app-webpack": "^3.13.4",
    "@quasar/extras": "^1.16.12",
    "pinia": "^2.0.11",
    "sass": "^1.78.0",
    "vue": "^3.5.0",
    "vue-router": "^4.0.0"
  },
  "devDependencies": {
    "@quasar/app-vite": "^1.3.0",
    "@types/node": "^12.20.21",
    "@typescript-eslint/eslint-plugin": "^5.10.0",
    "@typescript-eslint/parser": "^5.10.0",
    "@vue/test-utils": "^2.4.6",
    "autoprefixer": "^10.4.2",
    "axios": "^1.7.7",
    "babel-jest": "^26.6.3",
    "eslint": "^8.10.0",
    "eslint-config-prettier": "^8.1.0",
    "eslint-plugin-vue": "^9.0.0",
    "jest": "^26.6.3",
    "jest-serializer-vue": "^3.1.0",
    "prettier": "^2.5.1",
    "quasar": "^2.16.10",
    "typescript": "^4.5.4",
    "vue-jest": "^5.0.0-alpha.10",
    "ts-jest": "^29.2.5"
  },
  "engines": {
    "node": "^18 || ^16 || ^14.19",
    "npm": ">= 6.13.4",
    "yarn": ">= 1.21.1"
  }
}
````

## IndexPage.vue 架構和邏輯

`IndexPage.vue` 的主要架構和邏輯如下：

- **模板部分**：包含表格顯示數據和表單提交數據。
- **數據部分**：使用 `data` 定義表格數據 `rows` 和表單數據 `form`。
- **方法部分**：
  - `fetchData`：在組件掛載時調用，從 API 獲取數據並更新 `rows`。
  - `handleAddSubmit`：處理表單提交，將新數據發送到 API 並更新 `rows`。

```vue
<template>
  <!-- 省略模板代碼 -->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      rows: [],
      form: {
        name: '',
        age: null,
      },
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(
          'https://dahua.metcfire.com.tw/api/CRUDTest'
        );
        this.rows = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        this.rows = [];
      }
    },
    async handleAddSubmit() {
      try {
        const response = await axios.post(
          'https://dahua.metcfire.com.tw/api/CRUDTest',
          this.form
        );
        this.rows.push(response.data);
      } catch (error) {
        console.error('Error adding data:', error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
```

## 單元測試的邏輯

單元測試主要測試以下幾個方面：

1. **數據獲取**：測試 `fetchData` 方法是否能正確獲取數據並更新 `rows`。
2. **表單提交**：測試 `handleAddSubmit` 方法是否能正確提交數據並更新 `rows`。
3. **錯誤處理**：測試在數據獲取或提交失敗時是否能正確處理錯誤。

```javascript:tests/unit/IndexPage.spec.js
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
    axios.get.mockResolvedValue({ data: [{ id: 1, name: 'John Doe', age: 30 }] });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.rows).toEqual([{ id: 1, name: 'John Doe', age: 30 }]);
  });

  it('should handle add submit', async () => {
    axios.post.mockResolvedValue({ data: { id: 2, name: 'Jane Doe', age: 25 } });
    wrapper.setData({ form: { name: 'Jane Doe', age: 25 } });
    await wrapper.vm.handleAddSubmit();
    expect(axios.post).toHaveBeenCalledWith('https://dahua.metcfire.com.tw/api/CRUDTest', { name: 'Jane Doe', age: 25 });
  });

  it('should handle fetch data error', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await wrapper.vm.fetchData();
    expect(wrapper.vm.rows).toEqual([]);
  });
});
```

## 錯誤處理的邏輯

在 `IndexPage.vue` 中，錯誤處理主要集中在數據獲取和表單提交的異步操作中。使用 `try...catch` 語句來捕獲異常並進行處理：

- **數據獲取錯誤處理**：在 `fetchData` 方法中，如果數據獲取失敗，將錯誤記錄到控制台並將 `rows` 設置為空數組。
- **表單提交錯誤處理**：在 `handleAddSubmit` 方法中，如果數據提交失敗，將錯誤記錄到控制台。

## 表格排序和篩選功能的邏輯

表格排序和篩選功能可以通過 Quasar 的 `QTable` 組件來實現。以下是基本的邏輯：

- **排序**：使用 `QTable` 的內建排序功能，通過設置 `rows` 數據和 `sort-method` 來實現。
- **篩選**：使用 `QTable` 的內建篩選功能，通過設置 `filter` 和 `filter-method` 來實現。

```vue
<template>
  <q-page>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :filter-method="filterMethod"
      :sort-method="sortMethod"
    />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      rows: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'age',
          align: 'center',
          label: 'Age',
          field: 'age',
          sortable: true,
        },
      ],
      filter: '',
    };
  },
  methods: {
    filterMethod(rows, terms, cols, getCellValue) {
      return rows.filter((row) =>
        row.name.toLowerCase().includes(terms.toLowerCase())
      );
    },
    sortMethod(a, b, rowA, rowB, sortBy) {
      return rowA[sortBy] > rowB[sortBy] ? 1 : -1;
    },
  },
};
</script>
```

## 部署到 Vercel

我使用 Vercel 來部署這個項目，部署地址為 [https://interview-ten-tau.vercel.app/#/](https://interview-ten-tau.vercel.app/#/)。以下是部署過程：

1. **構建命令**：`quasar build`
2. **輸出目錄**：`dist/spa`

Vercel 會自動檢測到 Quasar 框架並進行最佳配置。

## 為什麼沒有使用 Pinia 的 Store

由於這個項目中需要調用的 API 很少，我選擇不使用 Pinia 來管理狀態，以節省時間和簡化結構。
