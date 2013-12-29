/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50519
Source Host           : localhost:13306
Source Database       : wms

Target Server Type    : MYSQL
Target Server Version : 50519
File Encoding         : 65001

Date: 2013-12-29 19:39:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `ryz_account`
-- ----------------------------
DROP TABLE IF EXISTS `ryz_account`;
CREATE TABLE `ryz_account` (
  `id` varchar(32) NOT NULL COMMENT '用户Id',
  `createDate` datetime NOT NULL COMMENT '注册时间',
  `modifyDate` datetime NOT NULL COMMENT '最后修改时间',
  `loginName` varchar(32) NOT NULL COMMENT '注册名_登陆名',
  `loginPwd` varchar(32) NOT NULL COMMENT '登录密码',
  `nickName` varchar(32) DEFAULT NULL COMMENT '昵称_显示名',
  `picPath` varchar(256) DEFAULT NULL COMMENT '图片相对路径',
  `sign` varchar(128) DEFAULT NULL COMMENT '个性签名',
  `birthday` datetime DEFAULT NULL COMMENT '用户生日',
  `sex` int(11) DEFAULT NULL COMMENT '用户性别',
  `state` int(11) NOT NULL COMMENT '用户状态',
  `mobile` varchar(32) DEFAULT NULL COMMENT '手机号',
  `qq` varchar(64) DEFAULT NULL COMMENT '用户QQ',
  `email` varchar(64) DEFAULT NULL COMMENT '用户邮箱',
  `ruyibiAll` bigint(20) NOT NULL COMMENT '如意币总额',
  `pkNum` bigint(20) NOT NULL COMMENT '用户开盘总数',
  `ruyibiLocked` bigint(20) NOT NULL COMMENT '如意币冻结金额',
  `ruyibi` bigint(20) NOT NULL COMMENT '如意币可用金额',
  `loginKey` varchar(128) DEFAULT NULL COMMENT '登录密钥',
  `loginDate` datetime DEFAULT NULL COMMENT '登录时间',
  PRIMARY KEY (`id`),
  KEY `INDEX_USERINFO_LOGINNAME` (`loginName`),
  KEY `INDEX_USERINFO_MOBILE` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';

-- ----------------------------
-- Records of ryz_account
-- ----------------------------
INSERT INTO `ryz_account` VALUES ('1', '2013-10-31 15:07:36', '2013-10-31 15:07:39', 'debug', 'debug', null, null, null, null, null, '0', null, null, null, '920', '3', '0', '920', 'eyJ2IjoiMS4wIiwidXNlcm5hbWUiOiJkZWJ1ZyIsImxvZ2luRGF0ZSI6IjEzODU5Njg2MDUwMzUiLCJjdCI6IjAifQ', '2013-12-02 15:16:45');
INSERT INTO `ryz_account` VALUES ('1e048e0c27e7476586f4d2d405ac97e1', '2013-11-05 12:01:11', '2013-11-05 12:01:11', 'zmg', 'zmg', null, null, null, null, null, '0', '', null, null, '0', '0', '0', '0', null, null);
INSERT INTO `ryz_account` VALUES ('48fe897ae83d4a5686ea0e9b8926e6e0', '2013-10-31 16:36:36', '2013-10-31 16:36:36', 'lzy', 'lzy', 'rererere', null, null, null, null, '0', null, null, null, '1080', '0', '0', '1080', null, null);
INSERT INTO `ryz_account` VALUES ('5138cd79ec424bbab5256806a5634698', '2013-11-05 12:04:03', '2013-11-05 12:04:03', 'jl', 'jl', null, null, null, null, null, '0', '', null, null, '0', '0', '0', '0', null, null);
INSERT INTO `ryz_account` VALUES ('c6a4b31489754623827165781c8e496b', '2013-11-05 11:54:12', '2013-11-05 11:54:12', 'yl', 'yl', null, null, null, null, null, '0', '15011111111', null, null, '0', '0', '0', '0', null, null);
INSERT INTO `ryz_account` VALUES ('f664fc5b219040f7b3c9e062aa937840', '2013-11-05 11:53:37', '2013-11-05 11:53:37', 'zfc', 'zfc', null, null, null, null, null, '0', '15011111111', null, null, '0', '0', '0', '0', null, null);

-- ----------------------------
-- Table structure for `ryz_feedback`
-- ----------------------------
DROP TABLE IF EXISTS `ryz_feedback`;
CREATE TABLE `ryz_feedback` (
  `id` varchar(32) NOT NULL COMMENT '反馈信息ID',
  `createDate` datetime NOT NULL COMMENT '反馈时间',
  `modifyDate` datetime NOT NULL COMMENT '最后修改时间',
  `content` varchar(500) NOT NULL COMMENT '反馈内容',
  `feedbackUserId` varchar(32) NOT NULL COMMENT '反馈人',
  `type` int(11) NOT NULL COMMENT '反馈类型',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户反馈信息表';

-- ----------------------------
-- Records of ryz_feedback
-- ----------------------------

-- ----------------------------
-- Table structure for `ryz_pankou_info`
-- ----------------------------
DROP TABLE IF EXISTS `ryz_pankou_info`;
CREATE TABLE `ryz_pankou_info` (
  `id` varchar(32) NOT NULL COMMENT '盘口信息ID',
  `createDate` datetime NOT NULL COMMENT '发盘时间',
  `modifyDate` datetime NOT NULL COMMENT '最后修改时间',
  `content` varchar(1000) DEFAULT NULL COMMENT '盘口内容',
  `endDate` datetime DEFAULT NULL COMMENT '结束时间',
  `ruyibi` int(11) DEFAULT NULL COMMENT '盘口如意币金额',
  `type` int(11) NOT NULL COMMENT '盘口类别',
  `pubUserId` varchar(32) NOT NULL COMMENT '发盘者用户ID',
  `recUserId` varchar(32) DEFAULT NULL COMMENT '接盘者用户ID',
  `pkDate` datetime DEFAULT NULL COMMENT 'PK发生时间',
  `judgeMethod` int(11) NOT NULL COMMENT '盘口判定方式',
  `outcome` int(11) DEFAULT NULL COMMENT 'PK结果',
  `judgeDate` datetime DEFAULT NULL COMMENT '结果判定时间',
  `state` int(11) NOT NULL COMMENT '盘口状态',
  `pv` bigint(20) NOT NULL COMMENT '盘口访问数',
  PRIMARY KEY (`id`),
  KEY `INDEX_PKINFO_PUBUSERID` (`pubUserId`),
  KEY `INDEX_PKINFO_RECUSERID` (`recUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='盘口信息表';

-- ----------------------------
-- Records of ryz_pankou_info
-- ----------------------------
INSERT INTO `ryz_pankou_info` VALUES ('130cbd7aa5c541c98d3d410f1b649a8b', '2013-10-31 17:30:01', '2013-10-31 17:30:01', '今天是个好日子', null, '100', '0', '1', '48fe897ae83d4a5686ea0e9b8926e6e0', '2013-11-03 13:58:31', '1', '0', '2013-11-03 14:27:35', '2', '1');
INSERT INTO `ryz_pankou_info` VALUES ('1776a465d3504663adb67d6bfa406aab', '2013-11-05 15:26:12', '2013-11-05 15:26:12', '千山万水总是情，发个盘口行不行', '2013-11-05 00:00:00', '10', '0', '1', '48fe897ae83d4a5686ea0e9b8926e6e0', '2013-11-05 15:39:59', '1', '1', '2013-11-05 15:58:56', '2', '33');
INSERT INTO `ryz_pankou_info` VALUES ('6415b9d09eb141b99227735e488473c2', '2013-11-05 16:56:35', '2013-11-05 16:56:35', '千山万水总是情，发个盘口行不行', null, '10', '0', '1', '48fe897ae83d4a5686ea0e9b8926e6e0', '2013-11-05 17:05:08', '1', '1', '2013-11-05 17:10:07', '2', '0');

-- ----------------------------
-- Table structure for `ryz_ruyibi_flow`
-- ----------------------------
DROP TABLE IF EXISTS `ryz_ruyibi_flow`;
CREATE TABLE `ryz_ruyibi_flow` (
  `id` varchar(32) NOT NULL COMMENT '流水ID',
  `createDate` datetime NOT NULL COMMENT '交易时间',
  `modifyDate` datetime NOT NULL COMMENT '最后修改时间',
  `userId` varchar(32) NOT NULL COMMENT '交易用户ID',
  `earningType` int(11) DEFAULT NULL COMMENT '收入方式',
  `expenseType` int(11) DEFAULT NULL COMMENT '支出方式',
  `earning` int(11) DEFAULT NULL COMMENT '收入金额',
  `expense` int(11) DEFAULT NULL COMMENT '支出金额',
  `pkInfoId` varchar(32) DEFAULT NULL COMMENT '相关盘口ID',
  PRIMARY KEY (`id`),
  KEY `INDEX_FLOW_USERID` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='如意币流水表：如意币流水表表,通过每日登录、盘口奖励、pk获取等途径的金币累计记录日志表';

-- ----------------------------
-- Records of ryz_ruyibi_flow
-- ----------------------------
INSERT INTO `ryz_ruyibi_flow` VALUES ('284852ba11544cf6a4a8d6d66fede304', '2013-11-05 15:58:56', '2013-11-05 15:58:56', '48fe897ae83d4a5686ea0e9b8926e6e0', null, '0', null, '10', '1776a465d3504663adb67d6bfa406aab');
INSERT INTO `ryz_ruyibi_flow` VALUES ('32bc414bfee44dccad646901a2704bfc', '2013-11-03 14:27:35', '2013-11-03 14:27:35', '48fe897ae83d4a5686ea0e9b8926e6e0', '1', null, '100', null, '130cbd7aa5c541c98d3d410f1b649a8b');
INSERT INTO `ryz_ruyibi_flow` VALUES ('645ac565f80d4886b0e5ed537c9bb331', '2013-11-05 17:10:07', '2013-11-05 17:10:07', '48fe897ae83d4a5686ea0e9b8926e6e0', null, '0', null, '10', '6415b9d09eb141b99227735e488473c2');
INSERT INTO `ryz_ruyibi_flow` VALUES ('87d8afd78fe94944a8314ca0a0013c75', '2013-11-05 15:58:56', '2013-11-05 15:58:56', '1', '1', null, '10', null, '1776a465d3504663adb67d6bfa406aab');
INSERT INTO `ryz_ruyibi_flow` VALUES ('cba769d3896041619aef9d1c4a73251f', '2013-11-05 17:10:07', '2013-11-05 17:10:07', '1', '1', null, '10', null, '6415b9d09eb141b99227735e488473c2');
INSERT INTO `ryz_ruyibi_flow` VALUES ('f63cbe45aea046769f6254d2079e1c1d', '2013-11-03 14:27:35', '2013-11-03 14:27:35', '1', null, '0', null, '100', '130cbd7aa5c541c98d3d410f1b649a8b');

-- ----------------------------
-- Table structure for `sys_role`
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` varchar(32) NOT NULL COMMENT '记录编号',
  `createDate` datetime DEFAULT NULL COMMENT '创建日期',
  `modifyDate` datetime DEFAULT NULL COMMENT '修改日期',
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  `description` varchar(128) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('402881e334cbcea20134cbd7c7b60002', '2012-01-11 16:17:23', '2012-02-27 16:17:42', '连锁总部', '总部管理人员');

-- ----------------------------
-- Table structure for `sys_roleuser`
-- ----------------------------
DROP TABLE IF EXISTS `sys_roleuser`;
CREATE TABLE `sys_roleuser` (
  `id` varchar(32) NOT NULL COMMENT '记录编号',
  `createDate` datetime DEFAULT NULL COMMENT '创建日期',
  `modifyDate` datetime DEFAULT NULL COMMENT '修改日期',
  `roleId` varchar(32) DEFAULT NULL COMMENT '角色ID',
  `username` varchar(32) DEFAULT NULL COMMENT '用户userName',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色用户关联表';

-- ----------------------------
-- Records of sys_roleuser
-- ----------------------------
INSERT INTO `sys_roleuser` VALUES ('1', '2013-11-05 23:25:18', '2013-11-05 23:25:20', '402881e334cbcea20134cbd7c7b60002', 'lzy');
INSERT INTO `sys_roleuser` VALUES ('2', '2013-11-05 23:25:41', '2013-11-05 23:26:36', '402881e334cbcea20134cbd7c7b60002', 'jzp');
INSERT INTO `sys_roleuser` VALUES ('3', '2013-11-05 23:26:58', '2013-11-05 23:27:01', '402881e334cbcea20134cbd7c7b60002', 'zfc');
INSERT INTO `sys_roleuser` VALUES ('4', '2013-11-05 23:27:23', '2013-11-05 23:27:25', '402881e334cbcea20134cbd7c7b60002', 'yl');
INSERT INTO `sys_roleuser` VALUES ('402881eb3ab02cb2013ab02ff3ca0007', '2012-10-30 13:41:03', '2012-10-30 13:41:03', '402881e334cbcea20134cbd7c7b60002', 'admin');
INSERT INTO `sys_roleuser` VALUES ('5', '2013-11-05 23:28:30', '2013-11-05 23:28:34', '402881e334cbcea20134cbd7c7b60002', 'zjl');

-- ----------------------------
-- Table structure for `sys_userinfo`
-- ----------------------------
DROP TABLE IF EXISTS `sys_userinfo`;
CREATE TABLE `sys_userinfo` (
  `id` varchar(32) NOT NULL COMMENT '记录编号',
  `createDate` datetime DEFAULT NULL COMMENT '创建日期',
  `modifyDate` datetime DEFAULT NULL COMMENT '修改日期',
  `username` varchar(32) DEFAULT NULL COMMENT '用户登录名',
  `realname` varchar(12) DEFAULT NULL COMMENT '真实姓名',
  `pwd` varchar(32) DEFAULT NULL COMMENT '登录密码',
  `mobile` varchar(32) DEFAULT NULL COMMENT '移动电话号码',
  `email` varchar(32) DEFAULT NULL COMMENT '邮件',
  `qq` varchar(32) DEFAULT NULL COMMENT 'QQ',
  `tel` varchar(32) DEFAULT NULL COMMENT '电话',
  `memo` varchar(64) DEFAULT NULL COMMENT '备注',
  `inuse` int(11) DEFAULT NULL COMMENT '是否停用',
  `tag` varchar(255) DEFAULT NULL,
  `isSystem` bit(1) DEFAULT NULL COMMENT '是否系统默认',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_sys_userinfo_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息';

-- ----------------------------
-- Records of sys_userinfo
-- ----------------------------
INSERT INTO `sys_userinfo` VALUES ('1', '2011-11-09 15:24:27', '2013-12-04 23:41:00', 'admin', '系统管理员', '21232f297a57a5a743894a0e4a801fc3', '15201329157', 'tangffei@163.com', '112050846', '15201329157', null, '0', ';admin,;系统管理员,', '');

-- ----------------------------
-- Table structure for `wms_customer`
-- ----------------------------
DROP TABLE IF EXISTS `wms_customer`;
CREATE TABLE `wms_customer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编码',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `type` int(11) NOT NULL COMMENT '类型（0供应商1客户）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='供应商客户';

-- ----------------------------
-- Records of wms_customer
-- ----------------------------
INSERT INTO `wms_customer` VALUES ('1', '北京可口', '0');
INSERT INTO `wms_customer` VALUES ('2', '家乐福', '1');

-- ----------------------------
-- Table structure for `wms_employe`
-- ----------------------------
DROP TABLE IF EXISTS `wms_employe`;
CREATE TABLE `wms_employe` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编码',
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='员工';

-- ----------------------------
-- Records of wms_employe
-- ----------------------------
INSERT INTO `wms_employe` VALUES ('1', '王五');

-- ----------------------------
-- Table structure for `wms_flow`
-- ----------------------------
DROP TABLE IF EXISTS `wms_flow`;
CREATE TABLE `wms_flow` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '流水ID',
  `type` int(11) NOT NULL COMMENT '类型',
  `formId` bigint(20) NOT NULL COMMENT '单据号',
  `inStorage` varchar(32) DEFAULT NULL COMMENT '入库仓库号',
  `miStorage` varchar(32) DEFAULT NULL COMMENT '盘点仓库',
  `outStorage` varchar(32) DEFAULT NULL COMMENT '出库仓库号',
  `materialId` bigint(20) NOT NULL COMMENT '货号',
  `materialName` varchar(32) DEFAULT NULL COMMENT '货物名称',
  `quantity` double NOT NULL COMMENT '变动数量',
  `createDate` datetime NOT NULL COMMENT '变动时间',
  `worker` bigint(20) DEFAULT NULL COMMENT '作业人',
  `operator` varchar(32) DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100019 DEFAULT CHARSET=utf8 COMMENT='货物流水';

-- ----------------------------
-- Records of wms_flow
-- ----------------------------
INSERT INTO `wms_flow` VALUES ('100006', '0', '1008', '1', null, null, '1', '可乐', '11', '2013-12-16 13:56:44', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100007', '1', '1009', null, null, '1', '1', '可乐', '-1', '2013-12-16 13:58:11', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100008', '1', '1010', null, null, '1', '1', '可乐', '-1', '2013-12-16 14:02:15', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100009', '0', '1011', '2', null, null, '2', '雪碧', '21', '2013-12-16 14:05:49', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100010', '1', '1012', null, null, '2', '2', '雪碧', '-6', '2013-12-16 14:06:13', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100011', '2', '1022', '', null, '1', '1', '可乐', '-5', '2013-12-16 14:48:41', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100012', '2', '1022', '2', null, null, '1', '可乐', '5', '2013-12-16 14:48:41', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100013', '2', '1023', null, null, '1', '1', '可乐', '-1', '2013-12-16 14:59:41', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100014', '2', '1023', '2', null, null, '1', '可乐', '1', '2013-12-16 14:59:41', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100015', '2', '1023', null, null, '1', '1', '可乐', '-1', '2013-12-16 14:59:41', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100016', '2', '1023', '2', null, null, '1', '可乐', '1', '2013-12-16 14:59:41', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100017', '3', '1030', null, '1', null, '1', '可乐', '10', '2013-12-29 19:22:16', '1', 'admin');
INSERT INTO `wms_flow` VALUES ('100018', '3', '1031', null, '1', null, '1', '可乐', '-6', '2013-12-29 19:33:03', '1', 'admin');

-- ----------------------------
-- Table structure for `wms_form`
-- ----------------------------
DROP TABLE IF EXISTS `wms_form`;
CREATE TABLE `wms_form` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '单据号',
  `type` int(11) NOT NULL COMMENT '单据类型（0入库、1出库、2移库、3盘点）',
  `createDate` datetime NOT NULL COMMENT '创建时间',
  `worker` bigint(20) NOT NULL COMMENT '作业人',
  `optime` datetime DEFAULT NULL COMMENT '业务发生时间',
  `inStorage` varchar(32) DEFAULT NULL COMMENT '入库仓库',
  `outStorage` varchar(32) DEFAULT NULL COMMENT '出库仓库',
  `miStorage` varchar(32) DEFAULT NULL COMMENT '盘点仓库',
  `customer` varchar(32) DEFAULT NULL COMMENT '供应商/客户',
  `status` int(11) DEFAULT NULL COMMENT '状态（0草稿1已过账）',
  `operator` varchar(32) DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1032 DEFAULT CHARSET=utf8 COMMENT='单据';

-- ----------------------------
-- Records of wms_form
-- ----------------------------
INSERT INTO `wms_form` VALUES ('1008', '0', '2013-12-16 13:56:44', '1', '2013-12-16 13:56:36', '1', null, null, '1', '1', 'admin');
INSERT INTO `wms_form` VALUES ('1009', '1', '2013-12-16 13:58:11', '1', '2013-12-16 13:58:00', null, '1', null, '2', '1', 'admin');
INSERT INTO `wms_form` VALUES ('1010', '1', '2013-12-16 14:02:15', '1', '2013-12-16 14:01:59', null, '1', null, '2', '1', 'admin');
INSERT INTO `wms_form` VALUES ('1011', '0', '2013-12-16 14:05:49', '1', '2013-12-16 14:05:33', '2', null, null, '1', '1', 'admin');
INSERT INTO `wms_form` VALUES ('1012', '1', '2013-12-16 14:06:13', '1', '2013-12-16 14:05:58', null, '2', null, '2', '1', 'admin');
INSERT INTO `wms_form` VALUES ('1022', '2', '2013-12-16 14:48:41', '1', '2013-12-16 14:48:31', '2', '1', null, null, '1', 'admin');
INSERT INTO `wms_form` VALUES ('1023', '2', '2013-12-16 14:59:41', '1', '2013-12-16 14:59:30', '2', '1', null, null, '1', 'admin');
INSERT INTO `wms_form` VALUES ('1030', '3', '2013-12-29 19:22:16', '1', '2013-12-29 19:21:55', null, null, '1', null, '1', 'admin');
INSERT INTO `wms_form` VALUES ('1031', '3', '2013-12-29 19:33:03', '1', '2013-12-29 19:32:31', null, null, '1', null, '1', 'admin');

-- ----------------------------
-- Table structure for `wms_form_detail`
-- ----------------------------
DROP TABLE IF EXISTS `wms_form_detail`;
CREATE TABLE `wms_form_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `formId` bigint(20) NOT NULL COMMENT '所属单据',
  `materialId` bigint(20) NOT NULL COMMENT '货物编号',
  `materialName` varchar(32) DEFAULT NULL COMMENT '货物名称',
  `quantity` double NOT NULL COMMENT '数量',
  `inStorageBinId` bigint(20) DEFAULT NULL COMMENT '仓位Id',
  `inStorageBinCode` varchar(32) DEFAULT NULL COMMENT '仓位编号',
  `outStorageBinId` bigint(20) DEFAULT NULL,
  `outStorageBinCode` varchar(32) DEFAULT NULL,
  `miStorageBinId` bigint(20) DEFAULT NULL,
  `miStorageBinCode` varchar(32) DEFAULT NULL,
  `oldQuantity` double DEFAULT NULL,
  `balance` double DEFAULT NULL COMMENT '差额（盘亏/盘赢）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COMMENT='单据明细';

-- ----------------------------
-- Records of wms_form_detail
-- ----------------------------
INSERT INTO `wms_form_detail` VALUES ('14', '1008', '1', '可乐', '11', '1', 'BJ-1-1', null, null, null, null, null, null);
INSERT INTO `wms_form_detail` VALUES ('15', '1009', '1', '可乐', '1', null, null, '1', 'BJ-1-1', null, null, null, null);
INSERT INTO `wms_form_detail` VALUES ('16', '1010', '1', '可乐', '1', null, null, '1', 'BJ-1-1', null, null, null, null);
INSERT INTO `wms_form_detail` VALUES ('17', '1011', '2', '雪碧', '21', '2', 'SH-1-1', null, null, null, null, null, null);
INSERT INTO `wms_form_detail` VALUES ('18', '1012', '2', '雪碧', '6', null, null, '2', 'SH-1-1', null, null, null, null);
INSERT INTO `wms_form_detail` VALUES ('28', '1022', '1', '可乐', '5', '2', 'SH-1-1', '1', 'BJ-1-1', null, null, null, null);
INSERT INTO `wms_form_detail` VALUES ('29', '1023', '1', '可乐', '1', '2', 'SH-1-1', '1', 'BJ-1-1', null, null, null, null);
INSERT INTO `wms_form_detail` VALUES ('35', '1030', '1', '可乐', '13', null, null, null, null, '1', 'BJ-1-1', '3', '10');
INSERT INTO `wms_form_detail` VALUES ('36', '1031', '1', '可乐', '10', null, null, null, null, '1', 'BJ-1-1', '16', '-6');

-- ----------------------------
-- Table structure for `wms_inventory`
-- ----------------------------
DROP TABLE IF EXISTS `wms_inventory`;
CREATE TABLE `wms_inventory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storageId` varchar(32) NOT NULL COMMENT '仓库',
  `materialId` bigint(20) NOT NULL COMMENT '货号',
  `quantity` double NOT NULL COMMENT '库存数量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COMMENT='仓库库存';

-- ----------------------------
-- Records of wms_inventory
-- ----------------------------
INSERT INTO `wms_inventory` VALUES ('2', '1', '1', '10');
INSERT INTO `wms_inventory` VALUES ('3', '2', '2', '15');
INSERT INTO `wms_inventory` VALUES ('10', '2', '1', '6');

-- ----------------------------
-- Table structure for `wms_inventory_bin`
-- ----------------------------
DROP TABLE IF EXISTS `wms_inventory_bin`;
CREATE TABLE `wms_inventory_bin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `storageId` varchar(32) NOT NULL COMMENT '仓库号',
  `storageBinId` bigint(20) NOT NULL COMMENT '仓位Id',
  `storageBinCode` varchar(32) NOT NULL COMMENT '仓位编号',
  `materialId` bigint(20) NOT NULL COMMENT '货物编号',
  `quantity` double NOT NULL COMMENT '库存数量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='仓位库存';

-- ----------------------------
-- Records of wms_inventory_bin
-- ----------------------------
INSERT INTO `wms_inventory_bin` VALUES ('3', '1', '1', 'BJ-1-1', '1', '26');
INSERT INTO `wms_inventory_bin` VALUES ('5', '2', '2', 'SH-1-1', '2', '15');
INSERT INTO `wms_inventory_bin` VALUES ('6', '2', '2', 'SH-1-1', '1', '6');

-- ----------------------------
-- Table structure for `wms_material`
-- ----------------------------
DROP TABLE IF EXISTS `wms_material`;
CREATE TABLE `wms_material` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '货号',
  `name` varchar(32) NOT NULL COMMENT '货物名称',
  `price` double(32,2) DEFAULT NULL COMMENT '价格',
  `tag` varchar(255) DEFAULT NULL COMMENT '查询标志',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='货物';

-- ----------------------------
-- Records of wms_material
-- ----------------------------
INSERT INTO `wms_material` VALUES ('1', '可乐', '1.00', ';1,;可乐,');
INSERT INTO `wms_material` VALUES ('2', '雪碧', '1.00', ';2,;雪碧,');

-- ----------------------------
-- Table structure for `wms_storage`
-- ----------------------------
DROP TABLE IF EXISTS `wms_storage`;
CREATE TABLE `wms_storage` (
  `id` varchar(32) NOT NULL COMMENT '仓库号',
  `name` varchar(32) DEFAULT NULL COMMENT '仓库名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='仓库';

-- ----------------------------
-- Records of wms_storage
-- ----------------------------
INSERT INTO `wms_storage` VALUES ('1', '北京仓');
INSERT INTO `wms_storage` VALUES ('2', '上海仓');

-- ----------------------------
-- Table structure for `wms_storage_bin`
-- ----------------------------
DROP TABLE IF EXISTS `wms_storage_bin`;
CREATE TABLE `wms_storage_bin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `binCode` varchar(32) NOT NULL COMMENT '仓位号',
  `storeId` varchar(32) NOT NULL COMMENT '所属仓库',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='仓位';

-- ----------------------------
-- Records of wms_storage_bin
-- ----------------------------
INSERT INTO `wms_storage_bin` VALUES ('1', 'BJ-1-1', '1');
INSERT INTO `wms_storage_bin` VALUES ('2', 'SH-1-1', '2');
