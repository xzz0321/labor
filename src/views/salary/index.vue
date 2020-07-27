<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户昵称" :prop="title=='修改工资交税管理'? '': userId">
        <el-select v-model="form.userId" placeholder="请选择用户昵称" :disabled="title=='修改工资交税管理'">
          <el-option
            v-for="dict in userOptions"
            :key="dict.id"
            :label="dict.personName"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="moblephone">
        <el-input
          v-model="queryParams.moblephone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户单位" prop="clientUnit">
        <el-input
          v-model="queryParams.clientUnit"
          placeholder="请输入客户单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- ：0已发放 1未发放 -->
      <el-form-item label="发放状态" prop="grantStatus">
        <el-select v-model="queryParams.grantStatus" placeholder="请选择发放状态" clearable size="small">
          <el-option
            v-for="dict in grantStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工资年份" prop="wagesYear">
        <el-date-picker
          v-model="queryParams.wagesYear"
          placeholder="请选择工资年份"
          clearable
          size="small"
          type="year"
          value-format="yyyy"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="工资月份" prop="wagesMonth">
        <el-date-picker
          v-model="queryParams.wagesMonth"
          placeholder="请选择工资月份"
          clearable
          size="small"
          type="month"
          value-format="yyyy-MM"
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:manage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:manage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:manage:remove']"
        >删除</el-button>
      </el-col>
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
      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <el-table-column label="手机号" align="center" prop="moblephone" />
      <el-table-column label="客户单位" align="center" prop="clientUnit" />
      <el-table-column label="应发工资" align="center" prop="salaryPayable" />
      <el-table-column label="实发工资" align="center" prop="salaryNet" />
      <!-- ：0已发放 1未发放 -->
      <el-table-column
        label="发放状态"
        align="center"
        prop="grantStatus"
        :formatter="grantStatusFormat"
      />
      <el-table-column label="工资年份" align="center" prop="wagesYear" />
      <el-table-column label="工资月份" align="center" prop="wagesMonth" />
      <!-- ：0正常 1停用 -->
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:manage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:manage:remove']"
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

    <!-- 添加或修改工资管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户昵称" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择用户昵称">
            <el-option
              v-for="dict in userOptions"
              :key="dict.id"
              :label="dict.personName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="moblephone">
          <el-input v-model="form.moblephone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="客户单位" prop="clientUnit">
          <el-input v-model="form.clientUnit" placeholder="请输入客户单位" />
        </el-form-item>
        <el-form-item label="应发工资" prop="salaryPayable">
          <el-input v-model="form.salaryPayable" placeholder="请输入应发工资" />
        </el-form-item>
        <el-form-item label="实发工资" prop="salaryNet">
          <el-input v-model="form.salaryNet" placeholder="请输入实发工资" />
        </el-form-item>
        <!-- ：0已发放 1未发放 -->
        <el-form-item label="发放状态">
          <el-select v-model="form.grantStatus" placeholder="请选择发放状态">
            <el-option
              v-for="dict in grantStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工资年份" prop="wagesYear">
          <el-date-picker
            v-model="form.wagesYear"
            placeholder="请选择工资年份"
            clearable
            type="year"
            value-format="yyyy"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="工资月份" prop="wagesMonth">
          <el-date-picker
            v-model="form.wagesMonth"
            placeholder="请选择工资月份"
            clearable
            type="month"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-form-item>
        <!-- ：0正常 1停用 -->
        <el-form-item label="状态">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option
              v-for="dict in stateOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
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
import { listManage, getManage, delManage, addManage, updateManage, exportManage, getUser } from "@/api/salary/index";

export default {
  name: "salary",
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 发放状态：0已发放 1未发放字典
      grantStatusOptions: [],
      // 状态：0正常 1停用字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        moblephone: undefined,
        clientUnit: undefined,
        grantStatus: undefined,
        wagesYear: undefined,
        wagesMonth: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [{ required: true, message: '请选择用户昵称', trigger: 'change' }],
        moblephone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        clientUnit: [{ required: true, message: '请输入客户单位', trigger: 'blur' }],
        salaryPayable: [{ required: true, message: '请输入应发工资', trigger: 'blur' }],
        salaryNet: [{ required: true, message: '请输入实发工资', trigger: 'blur' }],
        grantStatus: [{ required: true, message: '请选择发放状态', trigger: 'change' }],
        wagesYear: [{ required: true, message: '请选择工资年份', trigger: 'change' }],
        wagesMonth: [{ required: true, message: '请选择工资年份', trigger: 'change' }],
      },
      // 员工信息
      userOptions: []
    };
  },
  created () {
    this.getList();
    getUser().then(response => {
      this.userOptions = response.rows;
    });
    this.getDicts("grant_status").then(response => {
      this.grantStatusOptions = response.data;
    });
    this.getDicts("sys_job_status").then(response => {
      this.stateOptions = response.data;
    });
  },
  methods: {
    /** 查询工资管理列表 */
    getList () {
      this.loading = true;
      listManage(this.queryParams).then(response => {
        this.manageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 发放状态：0已发放 1未发放字典翻译
    grantStatusFormat (row, column) {
      return this.selectDictLabel(this.grantStatusOptions, row.grantStatus);
    },
    // 状态：0正常 1停用字典翻译
    stateFormat (row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
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
        userId: undefined,
        nickName: undefined,
        moblephone: undefined,
        clientUnit: undefined,
        salaryPayable: undefined,
        salaryNet: undefined,
        grantStatus: undefined,
        wagesYear: undefined,
        wagesMonth: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        remark: undefined,
        delFlag: undefined,
        state: undefined
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
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加工资管理";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getManage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工资管理";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateManage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addManage(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除工资管理编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delManage(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有工资管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportManage(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>