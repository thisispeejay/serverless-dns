<?php
/**
 * Plugin Name: NEX AI Bridge
 * Plugin URI: https://nexwoodmart.local
 * Description: Secure bridge for AI-powered WoodMart management. Provides REST API endpoints for site inspection, template management, and controlled modifications.
 * Version: 0.1.0
 * Author: NEX Systems
 * License: Proprietary
 * Text Domain: nex-bridge
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('NEX_BRIDGE_VERSION', '0.1.0');
define('NEX_BRIDGE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('NEX_BRIDGE_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main NEX Bridge Class
 */
class NEX_Bridge {
    
    private static $instance = null;
    private $api_namespace = 'nex/v1';
    
    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        
        // Verify WoodMart is active
        add_action('admin_init', array($this, 'check_woodmart_active'));
    }
    
    /**
     * Check if WoodMart theme is active
     */
    public function check_woodmart_active() {
        $theme = wp_get_theme();
        if ($theme->get_template() !== 'woodmart') {
            add_action('admin_notices', function() {
                echo '<div class="notice notice-warning"><p><strong>NEX Bridge:</strong> WoodMart theme is not active. Some features may not work correctly.</p></div>';
            });
        }
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        
        // Site Info
        register_rest_route($this->api_namespace, '/site-info', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_site_info'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        // WoodMart Settings
        register_rest_route($this->api_namespace, '/woodmart/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_woodmart_settings'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        register_rest_route($this->api_namespace, '/woodmart/settings', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_woodmart_settings'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        // Header Builder
        register_rest_route($this->api_namespace, '/headers', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_headers'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        register_rest_route($this->api_namespace, '/headers/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_header'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        register_rest_route($this->api_namespace, '/headers', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_header'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        // Layouts
        register_rest_route($this->api_namespace, '/layouts', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_layouts'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        // Elementor Templates
        register_rest_route($this->api_namespace, '/elementor/templates', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_elementor_templates'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        register_rest_route($this->api_namespace, '/elementor/templates/import', array(
            'methods' => 'POST',
            'callback' => array($this, 'import_elementor_template'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        // Screenshot
        register_rest_route($this->api_namespace, '/screenshot', array(
            'methods' => 'POST',
            'callback' => array($this, 'take_screenshot'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        // Backup before changes
        register_rest_route($this->api_namespace, '/backup/create', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_backup'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
        
        // WooCommerce Info
        register_rest_route($this->api_namespace, '/woocommerce/info', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_woocommerce_info'),
            'permission_callback' => array($this, 'api_permission_check')
        ));
    }
    
    /**
     * API Permission Check
     */
    public function api_permission_check() {
        // Check for API key in header
        $api_key = isset($_SERVER['HTTP_X_NEX_API_KEY']) ? sanitize_text_field($_SERVER['HTTP_X_NEX_API_KEY']) : '';
        
        if (empty($api_key)) {
            return false;
        }
        
        // Verify against stored key
        $stored_key = get_option('nex_bridge_api_key');
        return hash_equals($stored_key, $api_key);
    }
    
    /**
     * Get Site Info
     */
    public function get_site_info($request) {
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'site_url' => get_site_url(),
                'site_title' => get_bloginfo('name'),
                'wordpress_version' => get_bloginfo('version'),
                'theme' => array(
                    'name' => wp_get_theme()->get('Name'),
                    'version' => wp_get_theme()->get('Version'),
                    'template' => wp_get_theme()->get_template()
                ),
                'plugins' => $this->get_active_plugins(),
                'php_version' => phpversion(),
                'memory_limit' => ini_get('memory_limit')
            )
        ));
    }
    
    /**
     * Get Active Plugins
     */
    private function get_active_plugins() {
        $plugins = array();
        $active_plugins = get_option('active_plugins');
        
        foreach ($active_plugins as $plugin) {
            $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin, false, false);
            $plugins[] = array(
                'name' => $plugin_data['Name'],
                'version' => $plugin_data['Version']
            );
        }
        
        return $plugins;
    }
    
    /**
     * Get WoodMart Settings
     */
    public function get_woodmart_settings($request) {
        $settings = get_option('wd_options', array());
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'settings' => $settings,
                'version' => get_option('wd_theme_version', '')
            )
        ));
    }
    
    /**
     * Update WoodMart Settings
     */
    public function update_woodmart_settings($request) {
        $params = $request->get_params();
        $settings = isset($params['settings']) ? $params['settings'] : array();
        
        // Create backup before updating
        $this->create_backup_internal('woodmart_settings');
        
        // Update settings
        update_option('wd_options', $settings);
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'WoodMart settings updated successfully',
            'data' => array(
                'updated_count' => count($settings)
            )
        ));
    }
    
    /**
     * Get Headers
     */
    public function get_headers($request) {
        $headers = get_posts(array(
            'post_type' => 'wd_header',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ));
        
        $header_list = array();
        foreach ($headers as $header) {
            $header_list[] = array(
                'id' => $header->ID,
                'title' => $header->post_title,
                'status' => $header->post_status,
                'is_default' => get_post_meta($header->ID, '_wd_header_is_default', true)
            );
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $header_list
        ));
    }
    
    /**
     * Get Single Header
     */
    public function get_header($request) {
        $header_id = $request['id'];
        $header = get_post($header_id);
        
        if (!$header || $header->post_type !== 'wd_header') {
            return rest_ensure_response(array(
                'success' => false,
                'message' => 'Header not found'
            ));
        }
        
        // Get header builder data
        $builder_data = get_post_meta($header_id, '_wd_header_builder', true);
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'id' => $header->ID,
                'title' => $header->post_title,
                'status' => $header->post_status,
                'builder_data' => $builder_data,
                'is_default' => get_post_meta($header_id, '_wd_header_is_default', true)
            )
        ));
    }
    
    /**
     * Create Header
     */
    public function create_header($request) {
        $params = $request->get_params();
        
        $header_id = wp_insert_post(array(
            'post_title' => $params['title'],
            'post_type' => 'wd_header',
            'post_status' => 'publish'
        ));
        
        if (is_wp_error($header_id)) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => $header_id->get_error_message()
            ));
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'id' => $header_id,
                'title' => $params['title']
            )
        ));
    }
    
    /**
     * Get Layouts
     */
    public function get_layouts($request) {
        $layouts = get_posts(array(
            'post_type' => 'wd_layout',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ));
        
        $layout_list = array();
        foreach ($layouts as $layout) {
            $layout_list[] = array(
                'id' => $layout->ID,
                'title' => $layout->post_title,
                'type' => get_post_meta($layout->ID, '_wd_layout_type', true),
                'location' => get_post_meta($layout->ID, '_wd_layout_location', true)
            );
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $layout_list
        ));
    }
    
    /**
     * Get Elementor Templates
     */
    public function get_elementor_templates($request) {
        $templates = \Elementor\Plugin::$instance->templates_manager->get_source('local')->get_items(array(
            'type' => 'all',
            'orderby' => 'modified',
            'order' => 'DESC'
        ));
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $templates
        ));
    }
    
    /**
     * Import Elementor Template
     */
    public function import_elementor_template($request) {
        $params = $request->get_params();
        $template_data = isset($params['template_data']) ? $params['template_data'] : array();
        
        if (empty($template_data)) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => 'No template data provided'
            ));
        }
        
        try {
            // Import template using Elementor's importer
            $imported = \Elementor\Plugin::$instance->templates_manager->import_template($template_data);
            
            if (is_wp_error($imported)) {
                throw new Exception($imported->get_error_message());
            }
            
            return rest_ensure_response(array(
                'success' => true,
                'message' => 'Template imported successfully',
                'data' => array(
                    'template_id' => $imported
                )
            ));
        } catch (Exception $e) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => 'Template import failed: ' . $e->getMessage()
            ));
        }
    }
    
    /**
     * Take Screenshot
     */
    public function take_screenshot($request) {
        $params = $request->get_params();
        $url = isset($params['url']) ? esc_url_raw($params['url']) : get_site_url();
        $viewport = isset($params['viewport']) ? $params['viewport'] : array('width' => 1920, 'height' => 1080);
        
        // Note: Actual screenshot requires external service or headless browser
        // This is a placeholder implementation
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'url' => $url,
                'screenshot_url' => home_url('/wp-content/uploads/nex-screenshots/screenshot-' . time() . '.png'),
                'viewport' => $viewport,
                'timestamp' => current_time('mysql')
            ),
            'note' => 'Screenshot functionality requires additional setup with Playwright or similar'
        ));
    }
    
    /**
     * Create Backup
     */
    public function create_backup($request) {
        $params = $request->get_params();
        $backup_type = isset($params['type']) ? $params['type'] : 'full';
        
        return $this->create_backup_internal($backup_type);
    }
    
    /**
     * Internal backup creation
     */
    private function create_backup_internal($backup_type = 'full') {
        $backup_dir = WP_CONTENT_DIR . '/nex-backups/';
        
        if (!file_exists($backup_dir)) {
            wp_mkdir_p($backup_dir);
        }
        
        $backup_file = $backup_dir . 'backup-' . $backup_type . '-' . time() . '.json';
        
        $backup_data = array(
            'timestamp' => current_time('mysql'),
            'type' => $backup_type,
            'wordpress_version' => get_bloginfo('version'),
            'theme' => wp_get_theme()->get_template(),
            'data' => array()
        );
        
        if ($backup_type === 'woodmart_settings' || $backup_type === 'full') {
            $backup_data['data']['wd_options'] = get_option('wd_options', array());
            $backup_data['data']['wd_headers'] = $this->export_headers();
            $backup_data['data']['wd_layouts'] = $this->export_layouts();
        }
        
        file_put_contents($backup_file, json_encode($backup_data, JSON_PRETTY_PRINT));
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Backup created successfully',
            'data' => array(
                'backup_file' => str_replace(WP_CONTENT_DIR, '', $backup_file),
                'timestamp' => $backup_data['timestamp']
            )
        ));
    }
    
    /**
     * Export Headers
     */
    private function export_headers() {
        $headers = get_posts(array(
            'post_type' => 'wd_header',
            'posts_per_page' => -1
        ));
        
        $export = array();
        foreach ($headers as $header) {
            $export[] = array(
                'post' => $header,
                'meta' => get_post_meta($header->ID)
            );
        }
        
        return $export;
    }
    
    /**
     * Export Layouts
     */
    private function export_layouts() {
        $layouts = get_posts(array(
            'post_type' => 'wd_layout',
            'posts_per_page' => -1
        ));
        
        $export = array();
        foreach ($layouts as $layout) {
            $export[] = array(
                'post' => $layout,
                'meta' => get_post_meta($layout->ID)
            );
        }
        
        return $export;
    }
    
    /**
     * Get WooCommerce Info
     */
    public function get_woocommerce_info($request) {
        if (!class_exists('WooCommerce')) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => 'WooCommerce is not active'
            ));
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'version' => WC()->version,
                'pages' => $this->get_woocommerce_pages(),
                'settings' => array(
                    'currency' => get_woocommerce_currency(),
                    'currency_position' => get_option('woocommerce_currency_pos'),
                    'decimal_separator' => wc_format_decimal(1.1, 2),
                )
            )
        ));
    }
    
    /**
     * Get WooCommerce Pages
     */
    private function get_woocommerce_pages() {
        return array(
            'shop_page_id' => wc_get_page_id('shop'),
            'cart_page_id' => wc_get_page_id('cart'),
            'checkout_page_id' => wc_get_page_id('checkout'),
            'my_account_page_id' => wc_get_page_id('myaccount')
        );
    }
    
    /**
     * Add Admin Menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'NEX Bridge',
            'NEX Bridge',
            'manage_options',
            'nex-bridge',
            array($this, 'render_admin_page'),
            'dashicons-ai-assistant',
            100
        );
    }
    
    /**
     * Render Admin Page
     */
    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>NEX AI Bridge</h1>
            <p>Secure bridge for AI-powered WoodMart management.</p>
            
            <div style="max-width: 600px;">
                <h2>API Configuration</h2>
                <form method="post" action="options.php">
                    <?php
                    settings_fields('nex_bridge_settings');
                    do_settings_sections('nex_bridge_settings');
                    
                    $api_key = get_option('nex_bridge_api_key', '');
                    if (empty($api_key)) {
                        $api_key = wp_generate_password(32, false);
                        update_option('nex_bridge_api_key', $api_key);
                    }
                    ?>
                    <table class="form-table">
                        <tr>
                            <th><label for="nex_bridge_api_key">API Key</label></th>
                            <td>
                                <input type="text" id="nex_bridge_api_key" value="<?php echo esc_attr($api_key); ?>" class="regular-text" readonly />
                                <p class="description">Use this key in the X-NEX-API-Key header for API requests.</p>
                            </td>
                        </tr>
                        <tr>
                            <th><label>API Endpoint</label></th>
                            <td>
                                <code><?php echo rest_url('nex/v1/'); ?></code>
                            </td>
                        </tr>
                    </table>
                    
                    <h2>Status</h2>
                    <table class="widefat">
                        <tr>
                            <td><strong>WoodMart Theme:</strong></td>
                            <td><?php echo wp_get_theme()->get_template() === 'woodmart' ? '✅ Active' : '⚠️ Not Active'; ?></td>
                        </tr>
                        <tr>
                            <td><strong>Elementor:</strong></td>
                            <td><?php echo class_exists('Elementor\Plugin') ? '✅ Active' : '⚠️ Not Active'; ?></td>
                        </tr>
                        <tr>
                            <td><strong>WooCommerce:</strong></td>
                            <td><?php echo class_exists('WooCommerce') ? '✅ Active' : '⚠️ Not Active'; ?></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
        <?php
    }
    
    /**
     * Enqueue Admin Assets
     */
    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_nex-bridge') {
            return;
        }
        
        // Add admin styles if needed
        wp_enqueue_style('wp-color-picker');
    }
}

// Initialize plugin
function nex_bridge_init() {
    NEX_Bridge::get_instance();
}
add_action('plugins_loaded', 'nex_bridge_init');

// Activation hook
register_activation_hook(__FILE__, function() {
    // Generate API key on activation
    if (!get_option('nex_bridge_api_key')) {
        update_option('nex_bridge_api_key', wp_generate_password(32, false));
    }
    
    // Create backup directory
    $backup_dir = WP_CONTENT_DIR . '/nex-backups/';
    if (!file_exists($backup_dir)) {
        wp_mkdir_p($backup_dir);
    }
    
    // Create screenshots directory
    $screenshot_dir = WP_CONTENT_DIR . '/uploads/nex-screenshots/';
    if (!file_exists($screenshot_dir)) {
        wp_mkdir_p($screenshot_dir);
    }
    
    flush_rewrite_rules();
});

// Deactivation hook
register_deactivation_hook(__FILE__, function() {
    flush_rewrite_rules();
});
