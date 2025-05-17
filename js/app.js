/**
 * 图片压缩工具 - 主要JavaScript功能
 * 
 * 功能特点：
 * 1. 支持拖放上传和点击上传
 * 2. 支持图片预览
 * 3. 支持质量调整压缩
 * 4. 支持批量处理
 * 5. 显示压缩前后的大小对比
 */

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadCount = document.getElementById('upload-count');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const maxWidth = document.getElementById('max-width');
    const formatSelect = document.getElementById('format-select');
    const compressAllBtn = document.getElementById('compress-all-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const imagesContainer = document.getElementById('images-container');
    const emptyState = document.getElementById('empty-state');
    
    // 存储上传的图片
    const uploadedImages = [];
    
    // 初始化事件监听器
    initEventListeners();
    
    /**
     * 初始化所有事件监听器
     */
    function initEventListeners() {
        // 简化：只需要处理文件输入的变化，不需要处理上传区域的点击了
        fileInput.addEventListener('change', handleFileChange);
        
        // 上传区域拖放事件
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        
        // 质量滑块事件
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = `${qualitySlider.value}%`;
        });
        
        // 批量压缩按钮事件
        compressAllBtn.addEventListener('click', compressAllImages);
        
        // 批量下载按钮事件
        downloadAllBtn.addEventListener('click', downloadAllImages);
    }
    
    /**
     * 处理文件选择变化
     * @param {Event} e - 变化事件
     */
    function handleFileChange(e) {
        console.log('文件选择变化');
        if (e.target.files && e.target.files.length > 0) {
            console.log(`选择了 ${e.target.files.length} 个文件`);
            handleFiles(e.target.files);
        }
    }
    
    /**
     * 处理拖拽经过事件
     * @param {DragEvent} e - 拖拽事件对象
     */
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
    }
    
    /**
     * 处理拖拽离开事件
     * @param {DragEvent} e - 拖拽事件对象
     */
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
    }
    
    /**
     * 处理拖放事件
     * @param {DragEvent} e - 拖放事件对象
     */
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    }
    
    /**
     * 处理上传的文件
     * @param {FileList} files - 上传的文件列表
     */
    function handleFiles(files) {
        console.log('处理文件:', files.length);
        
        // 过滤出支持的图片格式
        const validFiles = Array.from(files).filter(file => 
            file.type.startsWith('image/jpeg') || 
            file.type.startsWith('image/png') || 
            file.type.startsWith('image/webp')
        );
        
        if (validFiles.length === 0) {
            alert('请上传PNG、JPG或WebP格式的图片');
            return;
        }
        
        // 处理每个文件
        validFiles.forEach(file => {
            processFile(file);
        });
        
        // 更新上传计数
        updateUploadCount();
        
        // 更新UI状态
        updateUIState();
    }
    
    /**
     * 处理单个文件
     * @param {File} file - 要处理的文件
     */
    function processFile(file) {
        // 生成唯一ID
        const id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // 保存图片数据
        const imageData = {
            id,
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            compressedSize: 0,
            compressedBlob: null,
            compressed: false
        };
        
        uploadedImages.push(imageData);
        
        // 创建图片项元素
        createImageItem(imageData);
        
        // 读取并显示图片
        const reader = new FileReader();
        reader.onload = (e) => {
            displayOriginalImage(id, e.target.result, file);
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * 创建图片项元素
     * @param {Object} imageData - 图片数据
     */
    function createImageItem(imageData) {
        // 隐藏空状态
        emptyState.style.display = 'none';
        
        // 从模板创建图片项
        const template = document.getElementById('image-item-template');
        const imageItem = document.importNode(template.content, true).querySelector('.image-item');
        
        // 设置ID
        imageItem.id = `image-${imageData.id}`;
        
        // 设置文件名
        imageItem.querySelector('.image-name').textContent = imageData.name;
        
        // 设置删除按钮事件
        imageItem.querySelector('.image-delete').addEventListener('click', () => {
            removeImage(imageData.id);
        });
        
        // 设置复选框事件
        const checkbox = imageItem.querySelector('.image-checkbox');
        checkbox.addEventListener('change', updateBatchButtons);
        
        // 设置压缩按钮事件
        imageItem.querySelector('.compress-button').addEventListener('click', () => {
            compressImage(imageData.id);
        });
        
        // 添加到容器
        imagesContainer.appendChild(imageItem);
        
        return imageItem;
    }
    
    /**
     * 显示原始图片
     * @param {string} id - 图片ID
     * @param {string} dataUrl - 图片数据URL
     * @param {File} file - 图片文件
     */
    function displayOriginalImage(id, dataUrl, file) {
        const imageItem = document.getElementById(`image-${id}`);
        if (!imageItem) return;
        
        // 设置原始图片预览
        const originalPreview = imageItem.querySelector('.image-preview.original .preview-img');
        originalPreview.src = dataUrl;
        
        // 读取图片尺寸
        const img = new Image();
        img.onload = () => {
            // 设置原始图片信息
            const sizeSpan = imageItem.querySelector('.image-preview.original .image-size');
            const dimensionsSpan = imageItem.querySelector('.image-preview.original .image-dimensions');
            
            sizeSpan.textContent = `大小: ${formatFileSize(file.size)}`;
            dimensionsSpan.textContent = `尺寸: ${img.width} × ${img.height}`;
            
            // 保存尺寸信息
            const index = uploadedImages.findIndex(img => img.id === id);
            if (index !== -1) {
                uploadedImages[index].width = img.width;
                uploadedImages[index].height = img.height;
            }
        };
        img.src = dataUrl;
    }
    
    /**
     * 压缩图片
     * @param {string} id - 图片ID
     */
    function compressImage(id) {
        const imageIndex = uploadedImages.findIndex(img => img.id === id);
        if (imageIndex === -1) return;
        
        const imageData = uploadedImages[imageIndex];
        const imageItem = document.getElementById(`image-${id}`);
        const compressButton = imageItem.querySelector('.compress-button');
        
        // 显示加载状态
        compressButton.innerHTML = '<span class="loading"></span>压缩中...';
        compressButton.disabled = true;
        
        // 获取压缩参数
        const quality = qualitySlider.value / 100;
        const maxWidthValue = maxWidth.value ? parseInt(maxWidth.value) : null;
        const format = formatSelect.value;
        
        // 创建图片对象
        const img = new Image();
        img.onload = () => {
            // 计算新尺寸
            let newWidth = img.width;
            let newHeight = img.height;
            
            if (maxWidthValue && img.width > maxWidthValue) {
                const ratio = maxWidthValue / img.width;
                newWidth = maxWidthValue;
                newHeight = Math.round(img.height * ratio);
            }
            
            // 创建canvas
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            // 绘制图片
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // 确定输出格式
            let outputType = imageData.type;
            if (format !== 'same') {
                outputType = `image/${format}`;
            }
            
            // 修复：对不同的格式使用合适的压缩选项
            let compressionOptions = {};
            
            if (outputType === 'image/jpeg') {
                // JPEG支持质量压缩
                compressionOptions = { quality: quality };
            } else if (outputType === 'image/png') {
                // PNG通常不用质量压缩，但可以减少颜色数量
                // 对于PNG，我们不设置质量参数，而是依赖宽度调整
                if (imageData.size > 1024 * 1024) { // 如果大于1MB
                    compressionOptions = { quality: 0.9 }; // 略微降低质量
                }
            } else if (outputType === 'image/webp') {
                // WebP支持高质量的压缩
                compressionOptions = { quality: quality };
            }
            
            // 对大图片特殊处理
            if (imageData.size > 5 * 1024 * 1024) { // 如果大于5MB
                if (outputType === 'image/jpeg' || outputType === 'image/webp') {
                    // 更激进地降低质量
                    compressionOptions.quality = Math.min(compressionOptions.quality, 0.7);
                }
            }
            
            // 导出压缩后的图片
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert('压缩失败，请尝试其他设置');
                    compressButton.innerHTML = '压缩';
                    compressButton.disabled = false;
                    return;
                }
                
                // 检查压缩后的大小是否变大
                if (blob.size >= imageData.size) {
                    // 如果压缩后更大，则进一步降低质量再试一次
                    let newQuality = quality * 0.7; // 降低30%的质量
                    
                    if (outputType === 'image/jpeg' || outputType === 'image/webp') {
                        canvas.toBlob((retryBlob) => {
                            if (!retryBlob || retryBlob.size >= imageData.size) {
                                // 如果还是比原图大，或者压缩失败，则使用原图尺寸的较低质量版本
                                const finalQuality = Math.min(quality * 0.5, 0.6); // 更激进的压缩
                                
                                canvas.toBlob((finalBlob) => {
                                    if (finalBlob && finalBlob.size < imageData.size) {
                                        // 使用最终的压缩版本
                                        handleCompressedBlob(finalBlob);
                                    } else {
                                        // 这里我们无法有效压缩，提示用户
                                        alert('无法有效压缩此图片，请尝试调整参数或选择其他格式');
                                        compressButton.innerHTML = '压缩';
                                        compressButton.disabled = false;
                                    }
                                }, outputType, finalQuality);
                            } else {
                                // 使用第二次尝试的压缩版本
                                handleCompressedBlob(retryBlob);
                            }
                        }, outputType, newQuality);
                    } else {
                        // 对于PNG等其他格式，我们尝试转换为JPEG来减小体积
                        canvas.toBlob((jpegBlob) => {
                            if (jpegBlob && jpegBlob.size < imageData.size) {
                                // 使用JPEG压缩版本
                                handleCompressedBlob(jpegBlob);
                            } else {
                                alert('无法有效压缩此图片，请尝试调整参数或选择JPEG格式');
                                compressButton.innerHTML = '压缩';
                                compressButton.disabled = false;
                            }
                        }, 'image/jpeg', 0.7);
                    }
                } else {
                    // 压缩成功，体积变小了
                    handleCompressedBlob(blob);
                }
                
                /**
                 * 处理压缩后的Blob
                 * @param {Blob} blob - 压缩后的图片Blob对象
                 */
                function handleCompressedBlob(blob) {
                    // 创建URL
                    const compressedUrl = URL.createObjectURL(blob);
                    
                    // 更新压缩后的预览
                    const compressedPreview = imageItem.querySelector('.image-preview.compressed .preview-img');
                    compressedPreview.src = compressedUrl;
                    
                    // 更新压缩后的信息
                    const sizeSpan = imageItem.querySelector('.image-preview.compressed .image-size');
                    const dimensionsSpan = imageItem.querySelector('.image-preview.compressed .image-dimensions');
                    const ratioSpan = imageItem.querySelector('.compression-ratio');
                    
                    sizeSpan.textContent = `大小: ${formatFileSize(blob.size)}`;
                    dimensionsSpan.textContent = `尺寸: ${newWidth} × ${newHeight}`;
                    
                    const compressionRatio = Math.round((1 - (blob.size / imageData.size)) * 100);
                    const savedText = compressionRatio > 0 ? `节省: ${compressionRatio}%` : `增加: ${Math.abs(compressionRatio)}%`;
                    const textColor = compressionRatio > 0 ? 'var(--success-color)' : 'var(--danger-color)';
                    
                    ratioSpan.textContent = savedText;
                    ratioSpan.style.color = textColor;
                    
                    // 设置下载链接
                    const downloadButton = imageItem.querySelector('.download-button');
                    downloadButton.href = compressedUrl;
                    downloadButton.download = getOutputFilename(imageData.name, format);
                    
                    // 更新图片数据
                    uploadedImages[imageIndex].compressedBlob = blob;
                    uploadedImages[imageIndex].compressedSize = blob.size;
                    uploadedImages[imageIndex].compressed = true;
                    uploadedImages[imageIndex].compressedUrl = compressedUrl;
                    
                    // 恢复按钮状态
                    compressButton.innerHTML = '重新压缩';
                    compressButton.disabled = false;
                    
                    // 更新UI状态
                    updateUIState();
                }
            }, outputType, compressionOptions.quality);
        };
        
        img.src = URL.createObjectURL(imageData.file);
    }
    
    /**
     * 压缩所有选中的图片
     */
    function compressAllImages() {
        const selectedIds = getSelectedImageIds();
        if (selectedIds.length === 0) return;
        
        // 逐个压缩选中的图片
        selectedIds.forEach(id => {
            compressImage(id);
        });
    }
    
    /**
     * 下载所有选中的压缩图片
     */
    function downloadAllImages() {
        const selectedIds = getSelectedImageIds();
        if (selectedIds.length === 0) return;
        
        // 过滤出已压缩的图片
        const compressedImages = uploadedImages.filter(img => 
            selectedIds.includes(img.id) && img.compressed
        );
        
        if (compressedImages.length === 0) {
            alert('请先压缩选中的图片');
            return;
        }
        
        // 逐个下载
        compressedImages.forEach(img => {
            // 创建临时下载链接
            const link = document.createElement('a');
            link.href = img.compressedUrl;
            link.download = getOutputFilename(img.name, formatSelect.value);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    /**
     * 获取选中的图片ID列表
     * @returns {Array} 选中的图片ID列表
     */
    function getSelectedImageIds() {
        const checkboxes = document.querySelectorAll('.image-checkbox:checked');
        return Array.from(checkboxes).map(checkbox => {
            const imageItem = checkbox.closest('.image-item');
            return imageItem.id.replace('image-', '');
        });
    }
    
    /**
     * 移除图片
     * @param {string} id - 图片ID
     */
    function removeImage(id) {
        // 从DOM中移除
        const imageItem = document.getElementById(`image-${id}`);
        if (imageItem) {
            imageItem.remove();
        }
        
        // 从数组中移除
        const index = uploadedImages.findIndex(img => img.id === id);
        if (index !== -1) {
            // 释放URL资源
            if (uploadedImages[index].compressedUrl) {
                URL.revokeObjectURL(uploadedImages[index].compressedUrl);
            }
            uploadedImages.splice(index, 1);
        }
        
        // 更新上传计数
        updateUploadCount();
        
        // 更新UI状态
        updateUIState();
    }
    
    /**
     * 更新上传计数
     */
    function updateUploadCount() {
        uploadCount.textContent = uploadedImages.length;
    }
    
    /**
     * 更新UI状态
     */
    function updateUIState() {
        // 显示/隐藏空状态
        emptyState.style.display = uploadedImages.length === 0 ? 'block' : 'none';
        
        // 启用/禁用批量按钮
        compressAllBtn.disabled = uploadedImages.length === 0;
        downloadAllBtn.disabled = !uploadedImages.some(img => img.compressed);
        
        // 更新批量按钮状态
        updateBatchButtons();
    }
    
    /**
     * 更新批量按钮状态
     */
    function updateBatchButtons() {
        const selectedIds = getSelectedImageIds();
        compressAllBtn.disabled = selectedIds.length === 0;
        
        const hasCompressed = uploadedImages.some(img => 
            selectedIds.includes(img.id) && img.compressed
        );
        
        downloadAllBtn.disabled = !hasCompressed;
    }
    
    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的大小
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * 根据原文件名和格式生成输出文件名
     * @param {string} originalName - 原文件名
     * @param {string} format - 输出格式
     * @returns {string} 输出文件名
     */
    function getOutputFilename(originalName, format) {
        if (format === 'same') {
            return originalName.replace(/(\.[^.]+)$/, '-compressed$1');
        }
        
        const baseName = originalName.replace(/\.[^.]+$/, '');
        return `${baseName}-compressed.${format}`;
    }
}); 