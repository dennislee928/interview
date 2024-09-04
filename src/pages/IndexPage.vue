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
      <q-btn type="submit" label="新增" />
      <q-banner v-if="errorMessage" type="negative">{{
        errorMessage
      }}</q-banner>
    </q-form>

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
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            icon="edit"
            @click="openEditDialog(props.row)"
          />
          <q-btn
            color="negative"
            icon="delete"
            @click="confirmDelete(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="editDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">編輯項目</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="updateData">
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
            <q-btn type="submit" label="確定" color="primary" />
            <q-btn @click="editDialog = false" label="取消" color="negative" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  QInput,
  QBtn,
  QForm,
  QPage,
  QTable,
  QBanner,
  QDialog,
  QCard,
  QCardSection,
  Dialog,
} from 'quasar';
import axios from 'axios';

export default {
  components: {
    QInput,
    QBtn,
    QForm,
    QPage, // 確認這裡是 QPage 而不是 qPage
    QTable,
    QBanner,
    QDialog,
    QCard,
    QCardSection,
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
        {
          name: 'actions',
          label: '操作',
          align: 'right',
        },
      ],
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 5,
      },
      editDialog: false, // 控制編輯對話框的顯示
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
    async confirmDelete(id) {
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
            `https://dahua.metcfire.com.tw/api/CRUDTest/${id}`
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
        this.editDialog = false; // 關閉對話框
      } catch (error) {
        this.errorMessage = '更新失敗，請稍後再試';
      }
    },
    openEditDialog(row) {
      this.form = { ...row }; // 將行資料複製到表單中
      this.editDialog = true; // 打開對話框
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
