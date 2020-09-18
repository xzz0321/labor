<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公司名称">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开户行账号">
        <el-input
          v-model="queryParams.bankAccountNumber"
          placeholder="请输入开户行账号"
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
          v-hasPermi="['business:company:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:company:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:company:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:company:export2']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5"><el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button></el-col>
    </el-row>

    <el-table v-loading="loading" :data="companyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="用工单位(团体)主键" align="center" prop="id" /> -->
      <el-table-column label="团体编号" align="center" prop="companyNumber" />
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="团体代表人" align="center" prop="legalPerson" />
      <!-- <el-table-column label="统一社会信用代码" align="center" prop="socialCreditCode" /> -->
      <el-table-column label="开户银行" align="center" prop="depositBank" />
      <el-table-column label="开户行户名" align="center" prop="bankName" />
      <el-table-column label="开户行账号" align="center" prop="bankAccountNumber" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="linkman" />
      <el-table-column label="联系电话" align="center" prop="replationPhone" />
      <!-- <el-table-column label="开票类型" align="center" prop="ticketType" />
      <el-table-column label="开票信息1" align="center" prop="ticketMessage1" />
      <el-table-column label="开票信息2" align="center" prop="ticketMessage2" />
      <el-table-column label="开票信息3" align="center" prop="ticketMessage3" />
      <el-table-column label="开票信息4" align="center" prop="ticketMessage4" />
      <el-table-column label="开票信息5" align="center" prop="ticketMessage5" /> -->
      <!-- <el-table-column label="业务经理" align="center" prop="businessPerson" /> -->
      <!-- <el-table-column label="人力经理" align="center" prop="humanManager" /> -->
      <el-table-column label="业务员" align="center" prop="salesman" />
      <el-table-column label="介绍人" align="center" prop="introducer" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
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
            v-hasPermi="['business:company:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:company:remove']"
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
    <!-- 添加或修改用工单位（团体）对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="团体编号" prop="companyNumber">
          <el-input v-model="form.companyNumber" placeholder="请输入团体编号" />
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="团体代表人" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="请输入团体代表人" />
        </el-form-item>
        <!-- <el-form-item label="统一社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item> -->
        <el-form-item label="开户银行" prop="depositBank">
          <el-input v-model="form.depositBank" placeholder="请输入开户银行" />
        </el-form-item>
        <el-form-item label="开户行户名" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户行户名" />
        </el-form-item>
        <el-form-item label="开户行账号" prop="bankAccountNumber">
          <el-input v-model="form.bankAccountNumber" placeholder="请输入开户行账号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="replationPhone">
          <el-input v-model="form.replationPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <!-- <el-form-item label="开票类型">
          <el-select v-model="form.ticketType" placeholder="请选择开票类型">
            <el-option label="请选择字典生成" value />
          </el-select>
        </el-form-item>
        <el-form-item label="开票信息1" prop="ticketMessage1">
          <el-input v-model="form.ticketMessage1" placeholder="请输入开票信息1" />
        </el-form-item>
        <el-form-item label="开票信息2" prop="ticketMessage2">
          <el-input v-model="form.ticketMessage2" placeholder="请输入开票信息2" />
        </el-form-item>
        <el-form-item label="开票信息3" prop="ticketMessage3">
          <el-input v-model="form.ticketMessage3" placeholder="请输入开票信息3" />
        </el-form-item>
        <el-form-item label="开票信息4" prop="ticketMessage4">
          <el-input v-model="form.ticketMessage4" placeholder="请输入开票信息4" />
        </el-form-item>
        <el-form-item label="开票信息5" prop="ticketMessage5">
          <el-input v-model="form.ticketMessage5" placeholder="请输入开票信息5" />
        </el-form-item>
        <el-form-item label="业务经理" prop="businessPerson">
          <el-input v-model="form.businessPerson" placeholder="请输入业务经理" />
        </el-form-item>
        <el-form-item label="人力经理" prop="humanManager">
          <el-input v-model="form.humanManager" placeholder="请输入人力经理" />
        </el-form-item> -->
        <el-form-item label="业务员" prop="salesman">
          <el-input v-model="form.salesman" placeholder="请输入业务员" />
        </el-form-item>
        <el-form-item label="介绍人" prop="introducer">
          <el-input v-model="form.introducer" placeholder="请输入介绍人" />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNumber">
          <el-input v-model="form.contractNumber" placeholder="请输入合同编号" />
        </el-form-item>
        <!-- <el-form-item label="类别  1是公司 2是团体" prop="category">
          <el-input v-model="form.category" placeholder="请输入类别  1是公司 2是团体" />
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCompany2,
  getCompany,
  delCompany,
  addCompany,
  updateCompany,
  exportCompany2,
} from "@/api/subject/company";
// 导入模板接口importTemplate
import { importTemplate } from "@/api/system/user";
import { getToken } from '@/utils/auth'

export default {
  name: "Company",
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
      // 用工单位（团体）表格数据
      companyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined,
        bankAccountNumber: undefined,
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
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyNumber: [
          { required: true, message: "请输入团体编号", trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        legalPerson: [
          { required: true, message: "请输入法人", trigger: "blur" },
        ],
        // socialCreditCode: [
        //   {
        //     required: true,
        //     message: "请输入统一社会信用代码",
        //     trigger: "blur",
        //   },
        // ],
        depositBank: [
          { required: true, message: "请输入开户银行", trigger: "blur" },
        ],
        bankName: [
          { required: true, message: "请输入开户行户名", trigger: "blur" },
        ],
        bankAccountNumber: [
          { required: true, message: "请输入开户行账号", trigger: "blur" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        linkman: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        replationPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        // ticketType: [
        //   { required: true, message: "请选择开票类型", trigger: "blur" },
        // ],
        // ticketMessage1: [
        //   { required: true, message: "请输入开票信息1", trigger: "blur" },
        // ],
        // ticketMessage2: [
        //   { required: true, message: "请输入开票信息2", trigger: "blur" },
        // ],
        // ticketMessage3: [
        //   { required: true, message: "请输入开票信息3", trigger: "blur" },
        // ],
        // ticketMessage4: [
        //   { required: true, message: "请输入开票信息4", trigger: "blur" },
        // ],
        // ticketMessage5: [
        //   { required: true, message: "请输入开票信息5", trigger: "blur" },
        // ],
        // businessPerson: [
        //   { required: true, message: "请输入业务经理", trigger: "blur" },
        // ],
        // humanManager: [
        //   { required: true, message: "请输入人力经理", trigger: "blur" },
        // ],
        salesman: [
          { required: true, message: "请输入业务员", trigger: "blur" },
        ],
        introducer: [
          { required: true, message: "请输入介绍人", trigger: "blur" },
        ],
        contractNumber: [
          { required: true, message: "请输入合同编号", trigger: "blur" },
        ],
        category: [
          {
            required: true,
            message: "请输入类别  1是公司 2是团体",
            trigger: "blur",
          },
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用工单位（团体）列表 */
    getList() {
      this.loading = true;
      listCompany2(this.queryParams).then((response) => {
        this.companyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        companyNumber: undefined,
        companyName: undefined,
        legalPerson: undefined,
        socialCreditCode: undefined,
        depositBank: undefined,
        bankName: undefined,
        bankAccountNumber: undefined,
        address: undefined,
        linkman: undefined,
        replationPhone: undefined,
        ticketType: undefined,
        ticketMessage1: undefined,
        ticketMessage2: undefined,
        ticketMessage3: undefined,
        ticketMessage4: undefined,
        ticketMessage5: undefined,
        businessPerson: undefined,
        humanManager: undefined,
        salesman: undefined,
        introducer: undefined,
        contractNumber: undefined,
        category: undefined,
        createDate: undefined,
        createBy: undefined,
        updateDate: undefined,
        updateBy: undefined,
        remark: undefined,
        delFlag: undefined,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用工单位（团体）";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCompany(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用工单位（团体）";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCompany(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCompany(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除用工单位（团体）编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCompany(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用工单位（团体）数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCompany2(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>