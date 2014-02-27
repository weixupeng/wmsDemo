package com.koomii.common;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.sql.DataSource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.authc.AccountException;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.config.ConfigurationException;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.realm.jdbc.JdbcRealm;
import org.apache.shiro.realm.jdbc.JdbcRealm.SaltStyle;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.apache.shiro.util.JdbcUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jfinal.plugin.activerecord.Db;

public class CommonRealm extends AuthorizingRealm {
	private Logger log = LoggerFactory.getLogger(CommonRealm.class);

    /*--------------------------------------------
    |             C O N S T A N T S             |
    ============================================*/
    /**
     * The default query used to retrieve account data for the user.
     */
    protected static final String DEFAULT_AUTHENTICATION_QUERY = "select password from users where username = ?";
    
    /**
     * The default query used to retrieve account data for the user when {@link #saltStyle} is COLUMN.
     */
    protected static final String DEFAULT_SALTED_AUTHENTICATION_QUERY = "select password, password_salt from users where username = ?";

    /**
     * The default query used to retrieve the roles that apply to a user.
     */
    protected static final String DEFAULT_USER_ROLES_QUERY = "select role_name from user_roles where username = ?";

    /**
     * The default query used to retrieve permissions that apply to a particular role.
     */
    protected static final String DEFAULT_PERMISSIONS_QUERY = "select permission from roles_permissions where role_name = ?";

    /**
     * Password hash salt configuration. <ul>
     *   <li>NO_SALT - password hashes are not salted.</li>
     *   <li>CRYPT - password hashes are stored in unix crypt format.</li>
     *   <li>COLUMN - salt is in a separate column in the database.</li> 
     *   <li>EXTERNAL - salt is not stored in the database. {@link #getSaltForUser(String)} will be called
     *       to get the salt</li></ul>
     */
    public enum SaltStyle {NO_SALT, CRYPT, COLUMN, EXTERNAL};

    /*--------------------------------------------
    |    I N S T A N C E   V A R I A B L E S    |
    ============================================*/
    protected String authenticationQuery = DEFAULT_AUTHENTICATION_QUERY;

    protected String userRolesQuery = DEFAULT_USER_ROLES_QUERY;

    protected String permissionsQuery = DEFAULT_PERMISSIONS_QUERY;

    protected boolean permissionsLookupEnabled = false;
    
    /*--------------------------------------------
    |         C O N S T R U C T O R S           |
    ============================================*/

    /*--------------------------------------------
    |  A C C E S S O R S / M O D I F I E R S    |
    ============================================*/
    
    /**
     * Overrides the default query used to retrieve a user's password during authentication.  When using the default
     * implementation, this query must take the user's username as a single parameter and return a single result
     * with the user's password as the first column.  If you require a solution that does not match this query
     * structure, you can override {@link #doGetAuthenticationInfo(org.apache.shiro.authc.AuthenticationToken)} or
     * just {@link #getPasswordForUser(java.sql.Connection,String)}
     *
     * @param authenticationQuery the query to use for authentication.
     * @see #DEFAULT_AUTHENTICATION_QUERY
     */
    public void setAuthenticationQuery(String authenticationQuery) {
        this.authenticationQuery = authenticationQuery;
    }

    /**
     * Overrides the default query used to retrieve a user's roles during authorization.  When using the default
     * implementation, this query must take the user's username as a single parameter and return a row
     * per role with a single column containing the role name.  If you require a solution that does not match this query
     * structure, you can override {@link #doGetAuthorizationInfo(PrincipalCollection)} or just
     * {@link #getRoleNamesForUser(java.sql.Connection,String)}
     *
     * @param userRolesQuery the query to use for retrieving a user's roles.
     * @see #DEFAULT_USER_ROLES_QUERY
     */
    public void setUserRolesQuery(String userRolesQuery) {
        this.userRolesQuery = userRolesQuery;
    }

    /**
     * Overrides the default query used to retrieve a user's permissions during authorization.  When using the default
     * implementation, this query must take a role name as the single parameter and return a row
     * per permission with three columns containing the fully qualified name of the permission class, the permission
     * name, and the permission actions (in that order).  If you require a solution that does not match this query
     * structure, you can override {@link #doGetAuthorizationInfo(org.apache.shiro.subject.PrincipalCollection)} or just
     * {@link #getPermissions(java.sql.Connection,String,java.util.Collection)}</p>
     * <p/>
     * <b>Permissions are only retrieved if you set {@link #permissionsLookupEnabled} to true.  Otherwise,
     * this query is ignored.</b>
     *
     * @param permissionsQuery the query to use for retrieving permissions for a role.
     * @see #DEFAULT_PERMISSIONS_QUERY
     * @see #setPermissionsLookupEnabled(boolean)
     */
    public void setPermissionsQuery(String permissionsQuery) {
        this.permissionsQuery = permissionsQuery;
    }

    /**
     * Enables lookup of permissions during authorization.  The default is "false" - meaning that only roles
     * are associated with a user.  Set this to true in order to lookup roles <b>and</b> permissions.
     *
     * @param permissionsLookupEnabled true if permissions should be looked up during authorization, or false if only
     *                                 roles should be looked up.
     */
    public void setPermissionsLookupEnabled(boolean permissionsLookupEnabled) {
        this.permissionsLookupEnabled = permissionsLookupEnabled;
    }
    
    /*--------------------------------------------
    |               M E T H O D S               |
    ============================================*/

    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
        String username = upToken.getUsername();

        // Null username is invalid
        if (username == null) {
            throw new AccountException("Null usernames are not allowed by this realm.");
        }
        SimpleAuthenticationInfo info = null;
        try {
            String password = Db.queryFirst(authenticationQuery,username);
            if (password == null) {
                throw new UnknownAccountException("No account found for user [" + username + "]");
            }
            info = new SimpleAuthenticationInfo(username, password.toCharArray(), getName());
        } catch (Exception e) {
            final String message = "There was a SQL error while authenticating user [" + username + "]";
            if (log.isErrorEnabled()) {
                log.error(message, e);
            }
            // Rethrow any SQL errors as an authentication exception
            throw new AuthenticationException(message, e);
        }
        return info;
    }

    /**
	 * 此方法是为用户加Role、permission的
     * This implementation of the interface expects the principals collection to return a String username keyed off of
     * this realm's {@link #getName() name}
     *
     * @see #getAuthorizationInfo(org.apache.shiro.subject.PrincipalCollection)
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {

        //null usernames are invalid
        if (principals == null) {
            throw new AuthorizationException("PrincipalCollection method argument cannot be null.");
        }

        String username = (String) getAvailablePrincipal(principals);

        Set<String> roleNames = new LinkedHashSet<String>();
        Set<String> permissions = new LinkedHashSet<String>();
        try {
            // Retrieve roles and permissions from database
            List<String> rnList = Db.query(userRolesQuery,username);
            roleNames.addAll(rnList);
            if (permissionsLookupEnabled) {
            	List<String> pList = getPermissions(username, roleNames);
            	permissions.addAll(pList);
            }

        } catch (Exception e) {
            final String message = "There was a SQL error while authorizing user [" + username + "]";
            if (log.isErrorEnabled()) {
                log.error(message, e);
            }
            // Rethrow any SQL errors as an authorization exception
            throw new AuthorizationException(message, e);
        }
        
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo(roleNames);
        info.setStringPermissions(permissions);
        return info;
    }

    protected List<String> getPermissions(String username, Collection<String> roleNames) {
        List<String> permissions = new ArrayList<String>();
        for (String roleName : roleNames) {
        	List<String> p = Db.query(permissionsQuery,roleName);
            permissions.addAll(p);
        }
        return permissions;
    }
    
    protected String getSaltForUser(String username) {
        return username;
    }

}
