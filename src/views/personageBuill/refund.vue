<!-- 个人缴费-退款管理 -->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="140px">
      <el-form-item label="退款状态" prop="refundMessage">
        <el-select v-model="queryParams.refundMessage" placeholder="请选择退款状态" clearable size="small">
          <el-option
            v-for="dict in refundMessageArr"
            :key="dict.value"
            :label="dict.name"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用工单位" prop="employerId">
        <el-input
          v-model="queryParams.employerId"
          placeholder="请输入用工单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="劳务派遣公司" prop="companyId">
        <el-input
          v-model="queryParams.companyId"
          placeholder="请输入劳务派遣公司"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="社保起始日期" prop="socialDate">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.socialDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择社保起始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="公积金起始日期" prop="accumulationDate">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.accumulationDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择公积金起始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-finance"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:message:remove']"
        >退款</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:message:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户id" align="center" prop="personId" />
      <!-- 0是未退款 1是已退款 2是已发起退款 3是已退回 -->
      <el-table-column label="退款" align="center" prop="refundMessage" />
      <el-table-column label="用工单位" align="center" prop="employerId" />
      <el-table-column label="劳务派遣公司" align="center" prop="companyId" />
      <el-table-column label="缴费方式" align="center" prop="payMethod" />
      <el-table-column label="缴费金额" align="center" prop="payMoney" />
      <el-table-column label="社保起始日期" align="center" prop="socialDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.socialDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="社保基数" align="center" prop="socialNumber" />
      <el-table-column label="养老" align="center" prop="socialOld" />
      <el-table-column label="医疗生育" align="center" prop="socialMedical" />
      <el-table-column label="工伤" align="center" prop="socialInjury" />
      <el-table-column label="失业" align="center" prop="socialUnemployment" />
      <el-table-column label="公积金起始日期" align="center" prop="accumulationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.accumulationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公积金基数" align="center" prop="accumulationNumber" />
      <el-table-column label="单位承担" align="center" prop="accumulationUnit" />
      <el-table-column label="个人承担" align="center" prop="accumulationPerson" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:message:remove']"
          >退款</el-button>
        </template>
      </el-table-column>
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
import { listMessage, delMessage, exportMessage } from "@/api/personageBuill/refund";

export default {
  name: "refund",
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
      // 缴费记录信息表格数据
      messageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        personId: undefined,
        refundMessage: undefined,
        employerId: undefined,
        companyId: undefined,
        payMoney: undefined,
        socialDate: undefined,
        socialNumber: undefined,
        socialOld: undefined,
        socialMedical: undefined,
        socialInjury: undefined,
        socialUnemployment: undefined,
        accumulationDate: undefined,
        accumulationNumber: undefined,
        accumulationUnit: undefined,
        accumulationPerson: undefined,
      },
      // 退款状态 0是未退款 1是已退款 2是已发起退款 3是已退回
      refundMessageArr: [
        { name: '未退款', value: 0, dictSort: 0 },
        { name: '已退款', value: 1, dictSort: 1 },
        { name: '已发起退款', value: 2, dictSort: 2 },
        { name: '已退回', value: 3, dictSort: 3 }
      ]
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询缴费记录信息列表 */
    getList () {
      this.loading = true;
      // listMessage(this.queryParams).then(response => {
      //   this.messageList = response.rows;
      //   this.total = response.total;
      this.loading = false;
      // });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        personId: undefined,
        refundMessage: undefined,
        employerId: undefined,
        companyId: undefined,
        payMoney: undefined,
        socialDate: undefined,
        socialNumber: undefined,
        socialOld: undefined,
        socialMedical: undefined,
        socialInjury: undefined,
        socialUnemployment: undefined,
        accumulationDate: undefined,
        accumulationNumber: undefined,
        accumulationUnit: undefined,
        accumulationPerson: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        delFlag: undefined
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
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除缴费记录信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delMessage(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    // /** 导出按钮操作 */
    // handleExport () {
    //   const queryParams = this.queryParams;
    //   this.$confirm('是否确认导出所有缴费记录信息数据项?', "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(function () {
    //     return exportMessage(queryParams);
    //   }).then(response => {
    //     this.download(response.msg);
    //   }).catch(function () { });
    // }
  }
};
</script>