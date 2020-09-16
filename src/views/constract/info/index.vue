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
      <el-form-item label="用工单位" prop="employUnit">
        <el-input
          v-model="queryParams.employUnit"
          placeholder="请输入用工单位"
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
      <el-form-item label="缴费方式" prop="paymentMethod">
        <el-input
          v-model="queryParams.paymentMethod"
          placeholder="请输入缴费方式"
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
      <el-form-item label="合同类别" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择合同类别" clearable size="small">
          <el-option
            v-for="dict in categoryOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
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
          v-hasPermi="['constract:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['constract:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['constract:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['constract:info:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="合同编号" align="center" prop="constractNumber" />
      <el-table-column label="派遣公司" align="center" prop="dispatchCompany" />
      <el-table-column label="用工单位" align="center" prop="employUnit" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="签约日期" align="center" prop="signDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费方式" align="center" prop="paymentMethod" />
      <el-table-column label="计费方式" align="center" prop="billMethod" />
      <el-table-column label="服务费" align="center" prop="serviceCharge" />
      <el-table-column label="业务员" align="center" prop="salesman" />
      <el-table-column label="人事经理" align="center" prop="personnelManager" />
      <el-table-column label="续签年限" align="center" prop="renewalTerm" />
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
            v-hasPermi="['constract:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['constract:info:remove']"
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

    <!-- 添加或修改企业合同和团队合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同编号" prop="constractNumber">
          <el-input v-model="form.constractNumber" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="派遣公司" prop="dispatchCompany">
          <el-input v-model="form.dispatchCompany" placeholder="请输入派遣公司" />
        </el-form-item>
        <el-form-item label="用工单位" prop="employUnit">
          <el-input v-model="form.employUnit" placeholder="请输入用工单位" />
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
        <el-form-item label="缴费方式" prop="paymentMethod">
          <el-input v-model="form.paymentMethod" placeholder="请输入缴费方式" />
        </el-form-item>
        <el-form-item label="计费方式" prop="billMethod">
          <el-input v-model="form.billMethod" placeholder="请输入计费方式" />
        </el-form-item>
        <el-form-item label="服务费" prop="serviceCharge">
          <el-input v-model="form.serviceCharge" placeholder="请输入服务费" />
        </el-form-item>
        <el-form-item label="补贴回款退费方式" prop="returnedMethod">
          <el-input v-model="form.returnedMethod" placeholder="请输入补贴回款退费方式" />
        </el-form-item>
        <el-form-item label="补贴回款退费名称" prop="returnedName">
          <el-input v-model="form.returnedName" placeholder="请输入补贴回款退费名称" />
        </el-form-item>
        <el-form-item label="补贴回款退费金额" prop="returnedMoney">
          <el-input v-model="form.returnedMoney" placeholder="请输入补贴回款退费金额" />
        </el-form-item>
        <el-form-item label="业务员" prop="salesman">
          <el-input v-model="form.salesman" placeholder="请输入业务员" />
        </el-form-item>
        <el-form-item label="人事经理" prop="personnelManager">
          <el-input v-model="form.personnelManager" placeholder="请输入人事经理" />
        </el-form-item>
        <el-form-item label="收款账号名称" prop="gatherName">
          <el-input v-model="form.gatherName" placeholder="请输入收款账号名称" />
        </el-form-item>
        <el-form-item label="合同类别">
          <el-radio-group v-model="form.category">
            <el-radio
              v-for="dict in categoryOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="续签年限" prop="renewalTerm">
          <el-input v-model="form.renewalTerm" placeholder="请输入续签年限" />
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/constract/info";

export default {
  name: "Info",
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
      // 企业合同和团队合同表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      // 合同类别字典
      categoryOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        constractNumber: undefined,
        dispatchCompany: undefined,
        employUnit: undefined,
        status: undefined,
        signDate: undefined,
        paymentMethod: undefined,
        salesman: undefined,
        personnelManager: undefined,
        category: undefined,
        createDate: undefined,
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
    this.getDicts("constract_category").then(response => {
      this.categoryOptions = response.data;
    });
  },
  methods: {
    /** 查询企业合同和团队合同列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 合同类别字典翻译
    categoryFormat(row, column) {
      return this.selectDictLabel(this.categoryOptions, row.category);
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
        employUnit: undefined,
        status: "0",
        signDate: undefined,
        termConstract: undefined,
        constractStartDate: undefined,
        constractEndDate: undefined,
        paymentMethod: undefined,
        billMethod: undefined,
        serviceCharge: undefined,
        returnedMethod: undefined,
        returnedName: undefined,
        returnedMoney: undefined,
        salesman: undefined,
        personnelManager: undefined,
        gatherName: undefined,
        category: "0",
        renewalTerm: undefined,
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
      this.title = "添加企业合同和团队合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改企业合同和团队合同";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
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
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除企业合同和团队合同编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有企业合同和团队合同数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>