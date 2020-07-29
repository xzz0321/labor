<!-- 派遣公司-人员管理 -->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公司名称" prop="companyNumber">
        <el-select v-model="queryParams.companyNumber" placeholder="请选择派遣公司" clearable size="small">
          <el-option
            v-for="dict in dispatchOptions"
            :key="dict.companyNumber"
            :label="dict.companyName"
            :value="dict.companyNumber"
          />
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:info:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:info:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-top"
          size="mini"
          @click="handleImport"
          v-hasPermi="['business:info:export']"
        >导入用户信息</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-bottom"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:info:export']"
        >下载模板</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:info:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="infoList"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工姓名" align="center" prop="personName" />
      <el-table-column
        label="劳务派遣公司"
        align="center"
        prop="companyId"
        width="160px"
        :formatter="Dispatch"
      />
      <el-table-column
        label="用工单位"
        align="center"
        prop="employerId"
        :formatter="DispatchEmployee"
        width="160px"
      />
      <!-- 0是未退款 1是已退款 2是已发起退款 3是已退回 -->
      <el-table-column label="民族" align="center" prop="personNation" />
      <el-table-column label="联系方式" align="center" prop="personRelation" width="110px" />
      <el-table-column label="性别" align="center" prop="personSex" />
      <!-- <el-table-column label="散户或单位" align="center" prop="personageOrUnit">
        <template slot-scope="scope">
          <span v-if="scope.row.personageOrUnit==2">单位</span>
          <span v-else>散戶</span>
        </template>
      </el-table-column>-->
      <el-table-column label="档案编号" align="center" prop="recordNumber" />
      <el-table-column label="返款比例" align="center" prop="refundRate" />
      <el-table-column label="补贴回款" align="center" prop="subsiryMoney" />
      <el-table-column label="养老" align="center" prop="socialOld" />
      <el-table-column label="医疗生育" align="center" prop="socialMedical" />
      <el-table-column label="工伤" align="center" prop="socialInjury" />
      <el-table-column label="失业" align="center" prop="socialUnemployment" />
      <el-table-column label="缴费方式" align="center" prop="payType" />
      <!-- <el-table-column label="缴费金额" align="center" prop="accumulationNumber" /> -->
      <el-table-column label="公积金基数" align="center" prop="accumulationNumber" />
      <el-table-column label="公积金起始日期" align="center" prop="accumulationDate" width="110px" />
      <el-table-column label="社保基数" align="center" prop="socialNumber" />
      <el-table-column label="社保起始日期" align="center" prop="socialDate" width="110px" />
      <el-table-column label="单位承担" align="center" prop="accumulationUnit" />
      <el-table-column label="个人承担" align="center" prop="accumulationPerson" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="140px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:info:remove']"
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

    <!-- 添加或修改派遣公司单位信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="公司名称" prop="companyId">
          <el-select
            v-model="form.companyId"
            placeholder="请选择派遣公司"
            clearable
            size="small"
            @change="getEmployeeOptions(form.companyId)"
          >
            <el-option
              v-for="dict in dispatchOptions"
              :key="dict.dispatchingId"
              :label="dict.companyName"
              :value="dict.dispatchingId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用工单位">
          <el-select v-model="form.employerId" placeholder="请选择用工单位" clearable size="small">
            <el-option
              v-for="dict in employeeOptions"
              :key="dict.unitId"
              :label="dict.companyName"
              :value="dict.unitId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="员工姓名" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="民族" prop="personNation">
          <el-input v-model="form.personNation" placeholder="请输入民族" />
        </el-form-item>
        <el-form-item label="联系方式" prop="personRelation">
          <el-input v-model="form.personRelation" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="性别" prop="personSex">
          <el-input v-model="form.personSex" placeholder="请输入性别" />
        </el-form-item>
        <!-- <el-form-item label="散户或单位" prop="personageOrUnit">
          <el-select v-model="form.personageOrUnit" placeholder="请选择散户或单位">
            <el-option
              v-for="dict in personageOrUnitOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="档案编号" prop="recordNumber">
          <el-input v-model="form.recordNumber" placeholder="请输入档案编号" />
        </el-form-item>
        <el-form-item label="返款比例" prop="refundRate">
          <el-input v-model="form.refundRate" placeholder="请输入返款比例" />
        </el-form-item>
        <el-form-item label="补贴回款" prop="subsiryMoney">
          <el-input v-model="form.subsiryMoney" placeholder="请输入补贴回款" />
        </el-form-item>
        <el-form-item label="养老" prop="socialOld">
          <el-input v-model="form.socialOld" placeholder="请输入养老" />
        </el-form-item>
        <el-form-item label="医疗生育" prop="socialMedical">
          <el-input v-model="form.socialMedical" placeholder="请输入医疗生育" />
        </el-form-item>
        <el-form-item label="工伤" prop="socialInjury">
          <el-input v-model="form.socialInjury" placeholder="请输入工伤" />
        </el-form-item>
        <el-form-item label="失业" prop="socialUnemployment">
          <el-input v-model="form.socialUnemployment" placeholder="请输入失业" />
        </el-form-item>
        <el-form-item label="缴费方式" prop="payType">
          <el-input v-model="form.payType" placeholder="请输入缴费方式" />
        </el-form-item>
        <el-form-item label="公积金基数" prop="accumulationNumber">
          <el-input v-model="form.accumulationNumber" placeholder="请输入公积金基数" />
        </el-form-item>
        <el-form-item label="公积金起始日期" prop="accumulationDate">
          <el-date-picker
            v-model="form.accumulationDate"
            placeholder="请选择公积金起始日期"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="社保基数" prop="socialNumber">
          <el-input v-model="form.socialNumber" placeholder="请输入社保基数" />
        </el-form-item>
        <el-form-item label="社保起始日期" prop="socialDate">
          <el-date-picker
            v-model="form.socialDate"
            placeholder="请选择社保起始日期"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="单位承担" prop="accumulationUnit">
          <el-input v-model="form.accumulationUnit" placeholder="请输入单位承担" />
        </el-form-item>
        <el-form-item label="个人承担" prop="accumulationPerson">
          <el-input v-model="form.accumulationPerson" placeholder="请输入个人承担" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-form
        :model="uploadForm"
        ref="uploadForm"
        :inline="true"
        label-width="100px"
        :rules="uploadRules"
      >
        <el-form-item label="公司名称" prop="companyId">
          <el-select
            v-model="uploadForm.companyId"
            placeholder="请选择派遣公司"
            clearable
            size="small"
            @change="getEmployeeOptions(uploadForm.companyId)"
          >
            <el-option
              v-for="dict in dispatchOptions"
              :key="dict.dispatchingId"
              :label="dict.companyName"
              :value="dict.dispatchingId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用工单位">
          <el-select v-model="uploadForm.employerId" placeholder="请选择用工单位" clearable size="small">
            <el-option
              v-for="dict in employeeOptions"
              :key="dict.unitId"
              :label="dict.companyName"
              :value="dict.unitId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :data="uploadForm"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>-->
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="uploadReset">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, delInfo, addInfo, updateInfo, exportInfo, getDispatch, selectDispatch } from "@/api/business/staff";
import { getEmployee, selectEmployee } from "@/api/personageBuill/refund";
import { getToken } from "@/utils/auth";

export default {
  name: "staff",
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
      // 派遣公司单位信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
        companyId: [{ required: true, message: '请选择', trigger: 'change' }],
        // employerId: [{ required: true, message: '请选择', trigger: 'change' }],
        personName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        personNation: [{ required: true, message: '请输入民族', trigger: 'blur' }],
        personRelation: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        personSex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        personageOrUnit: [{ required: true, message: '请选择散户或单位', trigger: 'change' }],
        recordNumber: [{ required: true, message: '请输入档案编号', trigger: 'blur' }],
        refundRate: [{ required: true, message: '请输入返款比例', trigger: 'blur' }],
        subsiryMoney: [{ required: true, message: '请输入补贴回款', trigger: 'blur' }],
        socialOld: [{ required: true, message: '请输入养老', trigger: 'blur' }],
        socialMedical: [{ required: true, message: '请输入医疗生育', trigger: 'blur' }],
        socialInjury: [{ required: true, message: '请输入工伤', trigger: 'blur' }],
        socialUnemployment: [{ required: true, message: '请输入失业', trigger: 'blur' }],
        payType: [{ required: true, message: '请输入缴费方式', trigger: 'blur' }],
        accumulationNumber: [{ required: true, message: '请输入公积金基数', trigger: 'blur' }],
        accumulationDate: [{ required: true, message: '请选择公积金起始日期', trigger: 'change' }],
        socialNumber: [{ required: true, message: '请输入社保基数', trigger: 'blur' }],
        socialDate: [{ required: true, message: '请选择社保起始日期', trigger: 'change' }],
        accumulationUnit: [{ required: true, message: '请输入单位承担', trigger: 'blur' }],
        accumulationPerson: [{ required: true, message: '请输入个人承担', trigger: 'blur' }],
      },
      // 派遣公司
      dispatchOptions: [],
      // 用工单位
      employeeOptions: [],
      personageOrUnitOptions: [],
      uploadForm: {
        employerId: undefined,
        companyId: undefined
      },
      uploadRules: {
        companyId: [{ required: true, message: '请选择', trigger: 'change' }]
        // employerId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        // updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/people/management/importData"
      }
    };
  },
  created () {
    this.getList();
    getDispatch().then(response => {
      this.dispatchOptions = response.rows;
    });
    getEmployee({}).then(response => {
      this.employeeOptions = response.rows;
    });
  },
  methods: {
    // 减员行
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      }
      return '';
    },
    // 获取用工单位
    getEmployeeOptions (id) {
      console.log(id)
      getEmployee({ companyId: id }).then(response => {
        this.employeeOptions = response.rows;
      });
    },
    // 派遣单位字典翻译
    Dispatch (row, column) {
      return selectDispatch(this.dispatchOptions, row.companyId);
    },
    // 用工单位字典翻译
    DispatchEmployee (row, column) {
      return selectEmployee(this.employeeOptions, row.employerId);
    },
    // 散户或单位字典翻译
    personageOrUnitFormat (row, column) {
      return this.selectDictLabel(this.personageOrUnitOptions, row.personageOrUnit);
    },
    /** 查询信息列表 */
    getList () {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        dispatchingId: undefined,
        companyNumber: undefined,
        companyName: undefined,
        creditCode: undefined,
        legalPerson: undefined,
        depositBank: undefined,
        depositBankAccount: undefined,
        address: undefined,
        linkman: undefined,
        phone: undefined,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加派遣公司人员名单";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      // const dispatchingId = row.id || this.ids
      this.form = row;
      this.open = true;
      this.title = "修改派遣公司人员名单";
    },
    /** 提交按钮 */
    submitForm: function () {
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
    uploadReset () {
      this.upload.open = false
      this.uploadForm = {
        employerId: undefined,
        companyId: undefined
      }
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = "用户信息导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm () {
      this.$refs["uploadForm"].validate(valid => {
        if (valid) {
          this.$refs.upload.submit();
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const dispatchingIds = row.id || this.ids;
      this.$confirm('是否确认删除派遣公司单位信息编号为"' + dispatchingIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delInfo(dispatchingIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      this.$confirm('是否确认下载导入模板?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportInfo();
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>

<style scoped lang="scss">
.app-container {
  .el-table {
    .warning-row {
      background: oldlace;
    }
    .success-row {
      background: #f0f9eb;
    }
  }
}
</style>