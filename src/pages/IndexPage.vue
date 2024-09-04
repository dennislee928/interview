<template>
  <q-page padding>
    <q-form @submit="onSubmit">
      <q-input
        v-model="form.name"
        label="姓名"
        :rules="[(val) => !!val || '姓名不得空白']"
        type="text"
      />
      <q-input
        v-model="form.age"
        label="年齡"
        type="number"
        :rules="[
          (val) => !!val || '年齡不得空白',
          (val) => val > 0 || '年齡必須是正整數',
        ]"
      />
      <q-btn type="submit" label="更新" />
      <q-banner v-if="errorMessage" type="negative">{{
        errorMessage
      }}</q-banner>
    </q-form>

    <q-btn @click="confirmDelete" label="刪除" color="negative" />

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      v-model:pagination="pagination"
    >
      <template v-slot:top>
        <q-input v-model="filter" placeholder="搜尋..." outlined dense />
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { Dialog, QInput, QBtn, QForm, QPage, QTable, QBanner } from 'quasar';
import axios from 'axios';

export default {
  components: {
    QInput,
    QBtn,
    QForm,
    QPage,
    QTable,
    QBanner,
  },
  data() {
    return {
      form: {
        name: '',
        age: null,
      },
      errorMessage: '',
      rows: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: '姓名',
          align: 'left',
          field: (row) => row.name,
          sortable: true,
        },
        {
          name: 'age',
          required: true,
          label: '年齡',
          align: 'left',
          field: (row) => row.age,
          sortable: true,
        },
      ],
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 5,
      },
    };
  },
  methods: {
    async onSubmit() {
      try {
        const response = await axios.post(
          'https://dahua.metcfire.com.tw/api/CRUDTest',
          this.form
        );
        console.log('新增成功', response.data);
        this.fetchData();
      } catch (error) {
        this.errorMessage = '提交失敗，請稍後再試';
      }
    },
    async confirmDelete() {
      Dialog.create({
        title: '確認刪除',
        message: '你確定要刪除這個項目嗎？',
        ok: {
          label: '確認',
          color: 'negative',
        },
        cancel: {
          label: '取消',
          color: 'primary',
        },
      }).onOk(async () => {
        try {
          const response = await axios.delete(
            `https://dahua.metcfire.com.tw/api/CRUDTest/${this.selectedRowId}`
          );
          console.log('刪除成功', response.data);
          this.fetchData();
        } catch (error) {
          this.errorMessage = '刪除失敗，請稍後再試';
        }
      });
    },
    async fetchData() {
      try {
        const response = await axios.get(
          'https://dahua.metcfire.com.tw/api/CRUDTest/a'
        );
        this.rows = response.data;
      } catch (error) {
        this.errorMessage = '查詢失敗，請稍後再試';
      }
    },
    async updateData() {
      try {
        const response = await axios.patch(
          'https://dahua.metcfire.com.tw/api/CRUDTest',
          this.form
        );
        console.log('更新成功', response.data);
        this.fetchData();
      } catch (error) {
        this.errorMessage = '更新失敗，請稍後再試';
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
