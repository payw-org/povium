<!DOCTYPE html>
<html>

    <head>
        <?php echo $__env->make('global-inclusion.global-meta', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>

        <?php echo $__env->yieldContent('head_meta_sub'); ?>

        <title><?php echo e($title); ?></title>

        <?php echo $__env->make('global-inclusion.global-css', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>

        <?php echo $__env->yieldContent('css_sub'); ?>
    </head>

    <body>
        <?php echo $__env->make('sections.globalnav', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>

        <?php echo $__env->yieldContent('content'); ?>

        <?php echo $__env->make('sections.globalfooter', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>

        <?php echo $__env->make('global-inclusion.global-script', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>

        <?php echo $__env->yieldContent('script_sub'); ?>
    </body>

</html>
