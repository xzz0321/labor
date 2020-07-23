<!-- 综合统计查询-公积金月报 -->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">
      <el-form-item label="姓名" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司名称" prop="grantStatus">
        <el-select v-model="queryParams.grantStatus" placeholder="请选择公司名称" clearable size="small">
          <el-option label="公司名称" value="公司名称" />
          <!-- <el-option
            v-for="dict in grantStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />-->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:manage:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="userId" />
      <el-table-column label="公司名称" align="center" prop="deptId" />
      <el-table-column label="开户银行账号" align="center" prop="nickName" />
      <el-table-column label="地址" align="center" prop="moblephone" />
      <el-table-column label="公积金基数" align="center" prop="salaryNet" />
      <el-table-column label="单位承担" align="center" prop="salaryNet" />
      <el-table-column label="个人承担" align="center" prop="salaryNet" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listProvident, exportProvident } from "@/api/synthetical/provident";

export default {
  name: "provident",
  data () {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 工资管理表格数据
      manageList: [],
      // 发放状态：0已发放 1未发放字典
      grantStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        grantStatus: undefined,
      }
    };
  },
  created () {
    this.getList();
    // this.getDicts("grant_status").then(response => {
    //   this.grantStatusOptions = response.data;
    // });
  },
  methods: {
    /** 查询工资管理列表 */
    getList () {
      this.loading = true;
      // listProvident(this.queryParams).then(response => {
      //   this.manageList = response.rows;
      //   this.total = response.total;
      this.loading = false;
      // });
    },
    // 发放状态：0已发放 1未发放字典翻译
    grantStatusFormat (row, column) {
      return this.selectDictLabel(this.grantStatusOptions, row.grantStatus);
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        userId: undefined,
        grantStatus: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有公积金月报数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        // return exportProvident(queryParams);
      }).then(response => {
        // this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>