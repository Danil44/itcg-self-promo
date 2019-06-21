from autoslug.utils import slugify


def get_upload_file_path(instance, filename):
    model_name = instance.__class__.__name__
    directory = slugify(model_name.encode('utf-8'))
    name, dot, extension = filename.rpartition('.')
    name = slugify(name)
    return '{}/{}.{}'.format(directory, name, extension)
