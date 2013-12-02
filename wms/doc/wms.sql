/*
Navicat MySQL Data Transfer

Source Server         : localhost13306
Source Server Version : 50519
Source Host           : localhost:13306
Source Database       : wms

Target Server Type    : MYSQL
Target Server Version : 50519
File Encoding         : 65001

Date: 2013-12-02 23:30:55
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
-- Table structure for `sys_moudle`
-- ----------------------------
DROP TABLE IF EXISTS `sys_moudle`;
CREATE TABLE `sys_moudle` (
  `id` varchar(32) NOT NULL COMMENT '记录编号',
  `createDate` datetime DEFAULT NULL COMMENT '创建日期',
  `modifyDate` datetime DEFAULT NULL COMMENT '修改日期',
  `tname` varchar(128) DEFAULT NULL COMMENT '表名',
  `cname` varchar(128) DEFAULT NULL COMMENT '中文名',
  `ename` varchar(128) DEFAULT NULL COMMENT '英文名',
  `parent` varchar(32) DEFAULT NULL COMMENT '上级名称',
  `url` varchar(256) DEFAULT NULL COMMENT 'url',
  `authUrl` text COMMENT '相关权限的URL，是JSON数组格式',
  `nmethod` varchar(32) DEFAULT NULL COMMENT '执行方法',
  `remark` varchar(128) DEFAULT NULL COMMENT 'div参数',
  `level` int(11) DEFAULT NULL COMMENT '级别',
  `act` varchar(256) DEFAULT NULL COMMENT '执行网址',
  `grantType` int(11) DEFAULT NULL COMMENT '授权类型，2新增/4修改/8删除',
  `type` int(11) DEFAULT NULL COMMENT '功能类型',
  `inuse` int(11) DEFAULT NULL COMMENT '0不使用 1使用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_sys_moudle_tname` (`tname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='功能模块表';

-- ----------------------------
-- Records of sys_moudle
-- ----------------------------
INSERT INTO `sys_moudle` VALUES ('daca88e0b7d2102f8ebedd5a28bb34d0', '2012-03-05 13:18:42', '2012-03-05 13:18:42', 'ymwz', '页面/文章', '页面/文章', '2', '', null, '', '', '0', 'dialog', null, '0', '1');

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
-- Table structure for `sys_rolemoudle`
-- ----------------------------
DROP TABLE IF EXISTS `sys_rolemoudle`;
CREATE TABLE `sys_rolemoudle` (
  `id` varchar(32) NOT NULL COMMENT '记录编号',
  `createDate` datetime DEFAULT NULL COMMENT '创建日期',
  `modifyDate` datetime DEFAULT NULL COMMENT '修改日期',
  `tname` varchar(128) DEFAULT NULL COMMENT '模块名',
  `roleId` varchar(32) DEFAULT NULL COMMENT '用户名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_rolemoudle
-- ----------------------------
INSERT INTO `sys_rolemoudle` VALUES ('q', '2013-09-26 16:41:22', '2013-09-26 16:41:25', 'ymwz', '402881e334cbcea20134cbd7c7b60002');

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
INSERT INTO `sys_userinfo` VALUES ('1', '2011-11-09 15:24:27', '2013-09-17 01:27:43', 'admin', '系统管理员', '21232f297a57a5a743894a0e4a801fc3', '15201329157', 'tangffei@163.com', '112050846', '15201329157', null, '0', 'admin 系统管理员 null', '');
