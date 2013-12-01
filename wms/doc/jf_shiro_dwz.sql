/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50519
Source Host           : localhost:13306
Source Database       : jf_shiro_dwz

Target Server Type    : MYSQL
Target Server Version : 50519
File Encoding         : 65001

Date: 2013-10-29 15:41:10
*/

SET FOREIGN_KEY_CHECKS=0;

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
INSERT INTO `sys_roleuser` VALUES ('402881eb3ab02cb2013ab02ff3ca0007', '2012-10-30 13:41:03', '2012-10-30 13:41:03', '402881e334cbcea20134cbd7c7b60002', 'admin');

-- ----------------------------
-- Table structure for `sys_userinfo`
-- ----------------------------
DROP TABLE IF EXISTS `sys_userinfo`;
CREATE TABLE `sys_userinfo` (
  `id` varchar(32) NOT NULL COMMENT '记录编号',
  `createDate` datetime DEFAULT NULL COMMENT '创建日期',
  `modifyDate` datetime DEFAULT NULL COMMENT '修改日期',
  `username` varchar(32) DEFAULT NULL COMMENT '用户登录名',
  `deptId` varchar(32) DEFAULT NULL COMMENT '部门ID',
  `realname` varchar(12) DEFAULT NULL COMMENT '真实姓名',
  `ename` varchar(12) DEFAULT NULL COMMENT '英文名',
  `pwd` varchar(32) DEFAULT NULL COMMENT '登录密码',
  `tel` varchar(32) DEFAULT NULL COMMENT '电话',
  `fax` varchar(32) DEFAULT NULL COMMENT '传真',
  `email` varchar(32) DEFAULT NULL COMMENT '邮件',
  `msn` varchar(32) DEFAULT NULL COMMENT 'MSN',
  `qq` varchar(32) DEFAULT NULL COMMENT 'QQ',
  `mobile` varchar(32) DEFAULT NULL COMMENT '移动电话号码',
  `memo` varchar(64) DEFAULT NULL COMMENT '备注',
  `inuse` int(11) DEFAULT NULL COMMENT '是否停用',
  `language` varchar(32) DEFAULT NULL COMMENT '语言',
  `zk` double DEFAULT NULL COMMENT '最低折扣',
  `czyh` double DEFAULT NULL COMMENT '储值优惠率',
  `branchCode` varchar(32) DEFAULT NULL COMMENT '所属分店',
  `organCode` varchar(32) DEFAULT NULL COMMENT '机构编码',
  `isDelete` int(11) DEFAULT NULL COMMENT '是否已删除',
  `tag` varchar(255) DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT '0后台用户 1前台用户',
  `isSystem` bit(1) DEFAULT NULL COMMENT '是否系统默认',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_sys_userinfo_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息';

-- ----------------------------
-- Records of sys_userinfo
-- ----------------------------
INSERT INTO `sys_userinfo` VALUES ('1', '2011-11-09 15:24:27', '2013-09-17 01:27:43', 'admin', null, '系统管理员', null, '21232f297a57a5a743894a0e4a801fc3', '15201329157', '33333333', 'tangffei@163.com', '', '112050846', '15201329157', null, '0', null, '1', '1', null, null, '0', 'admin 系统管理员 null', '0', '');
