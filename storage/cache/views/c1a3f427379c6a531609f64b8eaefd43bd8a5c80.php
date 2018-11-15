<?php $__env->startSection('content'); ?>

<main id="home-main">

    <section id="popular" class="post-section">

        <div class="post-view">
            <div class="guided-view">
                <ul class="post-container" data-post-pos="0">
                    <?php for($i = 0; $i < sizeof($post_img_link); $i++): ?>
                    <li class="post-wrapper">
                        <div class="post">
                            <a class="post-link" href="/register"></a>
                            <img class="hero" src="/assets/images/sets/<?php echo e($post_img_link[$i]); ?>.jpg" alt="">
                            <div class="post-contents">
                                <h1><?php echo e($post_title[$i]); ?></h1>
                                <span class="writer-name">- <?php echo e($post_writer[$i]); ?> -</span>
                            </div>
                        </div>
                    </li>
                    <?php endfor; ?>
                </ul>
            </div>
        </div>

    </section>

</main>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('script_sub'); ?>
    <script src="/build/js/main.built.js"></script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.base', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>