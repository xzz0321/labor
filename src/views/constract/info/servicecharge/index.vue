<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="合同编号" prop="constractNumber">
        <el-input
          v-model="queryParams.constractNumber"
          placeholder="请输入合同编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="派遣公司" prop="dispatchCompany">
        <el-input
          v-model="queryParams.dispatchCompany"
          placeholder="请输入派遣公司"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="员工姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入员工姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="签约日期" prop="signDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.signDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择签约日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否收取服务费" prop="serviceCharge">
        <el-select v-model="queryParams.serviceCharge" placeholder="请选择是否收取服务费" clearable size="small">
          <el-option
            v-for="dict in serviceChargeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="月数" prop="monthNumber">
        <el-input
          v-model="queryParams.monthNumber"
          placeholder="请输入月数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="费用名称" prop="costName">
        <el-input
          v-model="queryParams.costName"
          placeholder="请输入费用名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="费用金额" prop="costMoney">
        <el-input
          v-model="queryParams.costMoney"
          placeholder="请输入费用金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务员" prop="salesman">
        <el-input
          v-model="queryParams.salesman"
          placeholder="请输入业务员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="人事经理" prop="personnelManager">
        <el-input
          v-model="queryParams.personnelManager"
          placeholder="请输入人事经理"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.updateDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择更新时间">
        </el-date-picker>
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['constract:servicecharge:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['constract:servicecharge:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['constract:servicecharge:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['constract:servicecharge:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="servicechargeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="合同编号" align="center" prop="constractNumber" />
      <el-table-column label="派遣公司" align="center" prop="dispatchCompany" />
      <el-table-column label="员工姓名" align="center" prop="userName" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="签约日期" align="center" prop="signDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同期限" align="center" prop="termConstract" />
      <el-table-column label="合同起止日期" align="center" prop="constractStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.constractStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同结束日期" align="center" prop="constractEndDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.constractEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否收取服务费" align="center" prop="serviceCharge" :formatter="serviceChargeFormat" />
      <el-table-column label="月数" align="center" prop="monthNumber" />
      <el-table-column label="费用名称" align="center" prop="costName" />
      <el-table-column label="费用金额" align="center" prop="costMoney" />
      <el-table-column label="业务员" align="center" prop="salesman" />
      <el-table-column label="社保方案" align="center" prop="socialScheme" />
      <el-table-column label="人事经理" align="center" prop="personnelManager" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['constract:servicecharge:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['constract:servicecharge:remove']"
          >删除</el-button>
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

    <!-- 添加或修改个人合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同编号" prop="constractNumber">
          <el-input v-model="form.constractNumber" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="派遣公司" prop="dispatchCompany">
          <el-input v-model="form.dispatchCompany" placeholder="请输入派遣公司" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签约日期" prop="signDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.signDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择签约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同期限" prop="termConstract">
          <el-input v-model="form.termConstract" placeholder="请输入合同期限" />
        </el-form-item>
        <el-form-item label="合同起止日期" prop="constractStartDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.constractStartDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择合同起止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束日期" prop="constractEndDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.constractEndDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择合同结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否收取服务费">
          <el-radio-group v-model="form.serviceCharge">
            <el-radio
              v-for="dict in serviceChargeOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缴费方式" prop="paymentMethod">
          <el-input v-model="form.paymentMethod" placeholder="请输入缴费方式" />
        </el-form-item>
        <el-form-item label="月数" prop="monthNumber">
          <el-input v-model="form.monthNumber" placeholder="请输入月数" />
        </el-form-item>
        <el-form-item label="费用名称" prop="costName">
          <el-input v-model="form.costName" placeholder="请输入费用名称" />
        </el-form-item>
        <el-form-item label="费用金额" prop="costMoney">
          <el-input v-model="form.costMoney" placeholder="请输入费用金额" />
        </el-form-item>
        <el-form-item label="业务员" prop="salesman">
          <el-input v-model="form.salesman" placeholder="请输入业务员" />
        </el-form-item>
        <el-form-item label="约定工资" prop="agreedSalary">
          <el-input v-model="form.agreedSalary" placeholder="请输入约定工资" />
        </el-form-item>
        <el-form-item label="社保方案" prop="socialScheme">
          <el-input v-model="form.socialScheme" placeholder="请输入社保方案" />
        </el-form-item>
        <el-form-item label="公积金方案" prop="reserverScheme">
          <el-input v-model="form.reserverScheme" placeholder="请输入公积金方案" />
        </el-form-item>
        <el-form-item label="人事经理" prop="personnelManager">
          <el-input v-model="form.personnelManager" placeholder="请输入人事经理" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.createDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updateDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.updateDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listServicecharge, getServicecharge, delServicecharge, addServicecharge, updateServicecharge, exportServicecharge } from "@/api/constract/servicecharge";

export default {
  name: "Servicecharge",
  data() {
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
      // 个人合同表格数据
      servicechargeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      // 是否收取服务费字典
      serviceChargeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        constractNumber: undefined,
        dispatchCompany: undefined,
        userName: undefined,
        status: undefined,
        signDate: undefined,
        serviceCharge: undefined,
        monthNumber: undefined,
        costName: undefined,
        costMoney: undefined,
        salesman: undefined,
        personnelManager: undefined,
        createDate: undefined,
        updateDate: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("constract_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("constract_service_charge").then(response => {
      this.serviceChargeOptions = response.data;
    });
  },
  methods: {
    /** 查询个人合同列表 */
    getList() {
      this.loading = true;
      listServicecharge(this.queryParams).then(response => {
        this.servicechargeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 是否收取服务费字典翻译
    serviceChargeFormat(row, column) {
      return this.selectDictLabel(this.serviceChargeOptions, row.serviceCharge);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        constractNumber: undefined,
        dispatchCompany: undefined,
        userName: undefined,
        status: "0",
        signDate: undefined,
        termConstract: undefined,
        constractStartDate: undefined,
        constractEndDate: undefined,
        serviceCharge: "0",
        paymentMethod: undefined,
        monthNumber: undefined,
        costName: undefined,
        costMoney: undefined,
        salesman: undefined,
        agreedSalary: undefined,
        socialScheme: undefined,
        reserverScheme: undefined,
        personnelManager: undefined,
        createDate: undefined,
        createBy: undefined,
        updateDate: undefined,
        updateBy: undefined,
        remark: undefined,
        delFlag: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加个人合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getServicecharge(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改个人合同";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateServicecharge(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addServicecharge(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除个人合同编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delServicecharge(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有个人合同数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportServicecharge(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>