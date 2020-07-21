<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公司名称或个人姓名" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称或个人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:info:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="unitId" />
      <el-table-column label="公司编号" align="center" prop="companyNumber" />
      <el-table-column label="公司名称或个人姓名" align="center" prop="companyName" />
      <el-table-column
        label="散户或单位"
        align="center"
        prop="personageOrUnit"
        :formatter="personageOrUnitFormat"
      />
      <el-table-column label="单位类型" align="center" prop="unitType" :formatter="unitTypeFormat" />
      <el-table-column label="统一社会信用代码" align="center" prop="creditCode" />
      <el-table-column label="法定代表人" align="center" prop="legalPerson" />
      <el-table-column label="开户银行" align="center" prop="depositBank" />
      <el-table-column label="开户银行账号" align="center" prop="depositBankAccount" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="linkman" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="开票类型" align="center" prop="billType" :formatter="billTypeFormat" />
      <el-table-column label="开票信息1" align="center" prop="billInfoOne" />
      <el-table-column label="开票信息2" align="center" prop="billInfoTwo" />
      <el-table-column label="开票信息3" align="center" prop="billInfoThree" />
      <el-table-column label="开票信息4" align="center" prop="billInfoFour" />
      <el-table-column label="开票信息5" align="center" prop="billInfoFive" />
      <el-table-column label="业务员" align="center" prop="salesman" />
      <el-table-column label="管理员" align="center" prop="administrator" />
      <el-table-column label="介绍人" align="center" prop="introducer" />
      <el-table-column label="合同编号" align="center" prop="contractNumber" />
      <el-table-column label="合同起始日" align="center" prop="contractStartTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contractStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同结束日" align="center" prop="contractEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contractEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月度收款提醒日" align="center" prop="reminderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reminderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改日期" align="center" prop="endUpdateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endUpdateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:info:remove']"
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

    <!-- 添加或修改用工单位信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司编号" prop="companyNumber">
          <el-input v-model="form.companyNumber" placeholder="请输入公司编号" />
        </el-form-item>
        <el-form-item label="公司名称或个人姓名" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称或个人姓名" />
        </el-form-item>
        <el-form-item label="散户或单位">
          <el-select v-model="form.personageOrUnit" placeholder="请选择散户或单位">
            <el-option
              v-for="dict in personageOrUnitOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位类型">
          <el-select v-model="form.unitType" placeholder="请选择单位类型">
            <el-option
              v-for="dict in unitTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="请输入法定代表人" />
        </el-form-item>
        <el-form-item label="开户银行" prop="depositBank">
          <el-input v-model="form.depositBank" placeholder="请输入开户银行" />
        </el-form-item>
        <el-form-item label="开户银行账号" prop="depositBankAccount">
          <el-input v-model="form.depositBankAccount" placeholder="请输入开户银行账号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="开票类型">
          <el-select v-model="form.billType" placeholder="请选择开票类型">
            <el-option
              v-for="dict in billTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票信息1" prop="billInfoOne">
          <el-input v-model="form.billInfoOne" placeholder="请输入开票信息1" />
        </el-form-item>
        <el-form-item label="开票信息2" prop="billInfoTwo">
          <el-input v-model="form.billInfoTwo" placeholder="请输入开票信息2" />
        </el-form-item>
        <el-form-item label="开票信息3" prop="billInfoThree">
          <el-input v-model="form.billInfoThree" placeholder="请输入开票信息3" />
        </el-form-item>
        <el-form-item label="开票信息4" prop="billInfoFour">
          <el-input v-model="form.billInfoFour" placeholder="请输入开票信息4" />
        </el-form-item>
        <el-form-item label="开票信息5" prop="billInfoFive">
          <el-input v-model="form.billInfoFive" placeholder="请输入开票信息5" />
        </el-form-item>
        <el-form-item label="业务员" prop="salesman">
          <el-input v-model="form.salesman" placeholder="请输入业务员" />
        </el-form-item>
        <el-form-item label="管理员" prop="administrator">
          <el-input v-model="form.administrator" placeholder="请输入管理员" />
        </el-form-item>
        <el-form-item label="介绍人" prop="introducer">
          <el-input v-model="form.introducer" placeholder="请输入介绍人" />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNumber">
          <el-input v-model="form.contractNumber" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="合同起始日" prop="contractStartTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.contractStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择合同起始日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束日" prop="contractEndTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.contractEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择合同结束日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="月度收款提醒日" prop="reminderTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.reminderTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择月度收款提醒日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="最后修改日期" prop="endUpdateTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.endUpdateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后修改日期"
          ></el-date-picker>
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/employingUnit/info";

export default {
  name: "employingUnit",
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
      // 用工单位信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 散户或单位字典
      personageOrUnitOptions: [],
      // 单位类型字典
      unitTypeOptions: [],
      // 开票类型字典
      billTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created () {
    this.getList();
    this.getDicts("personage_unit").then(response => {
      this.personageOrUnitOptions = response.data;
    });
    this.getDicts("sys_unit_type").then(response => {
      this.unitTypeOptions = response.data;
    });
    this.getDicts("bill_type").then(response => {
      this.billTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询用工单位信息列表 */
    getList () {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 散户或单位字典翻译
    personageOrUnitFormat (row, column) {
      return this.selectDictLabel(this.personageOrUnitOptions, row.personageOrUnit);
    },
    // 单位类型字典翻译
    unitTypeFormat (row, column) {
      return this.selectDictLabel(this.unitTypeOptions, row.unitType);
    },
    // 开票类型字典翻译
    billTypeFormat (row, column) {
      return this.selectDictLabel(this.billTypeOptions, row.billType);
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        unitId: undefined,
        companyNumber: undefined,
        companyName: undefined,
        personageOrUnit: undefined,
        unitType: undefined,
        creditCode: undefined,
        legalPerson: undefined,
        depositBank: undefined,
        depositBankAccount: undefined,
        address: undefined,
        linkman: undefined,
        phone: undefined,
        billType: undefined,
        billInfoOne: undefined,
        billInfoTwo: undefined,
        billInfoThree: undefined,
        billInfoFour: undefined,
        billInfoFive: undefined,
        salesman: undefined,
        administrator: undefined,
        introducer: undefined,
        contractNumber: undefined,
        contractStartTime: undefined,
        contractEndTime: undefined,
        reminderTime: undefined,
        endUpdateTime: undefined,
        delFlag: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createTime: undefined,
        createBy: undefined,
        remark: undefined
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
      this.ids = selection.map(item => item.unitId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加用工单位信息";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const unitId = row.unitId || this.ids
      getInfo(unitId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用工单位信息";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.unitId != undefined) {
            updateInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addInfo(this.form).then(response => {
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
    handleDelete (row) {
      const unitIds = row.unitId || this.ids;
      this.$confirm('是否确认删除用工单位信息编号为"' + unitIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delInfo(unitIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用工单位信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportInfo(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>